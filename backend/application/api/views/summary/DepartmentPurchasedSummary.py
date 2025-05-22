from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from application.api.serializers import DateRangeQuerySerializer
from application.api.pagination import DepartmentSummaryPagination
from application.models import Department, Asset
from collections import Counter
from django.db.models import Sum

class DepartmentPurchasedSummary(APIView):
    # permission_classes = [IsAuthenticated]
    pagination_classes = DepartmentSummaryPagination
    
    def get(self, request):
        query_serializer = DateRangeQuerySerializer(data=request.query_params)
        
        if not query_serializer.is_valid():
            return Response(query_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        start_date = query_serializer.validated_data["start_date"]
        end_date = query_serializer.validated_data["end_date"]
        
        summary_data = self.generate_summary(start_date, end_date)
        
        return self.paginated_response(request, summary_data)
        
    def paginated_response(self, request, response):
        paginator = self.pagination_classes()
        paginated_data = paginator.paginate_queryset(response, request, view=self)
        
        return paginator.get_paginated_response(paginated_data)
        
    def generate_summary(self, start_date, end_date):
        department_obj = Department.objects.all()
        
        return [
            {
                "department": dept.department,
                "total_assets_purchased": (assets := Asset.objects.filter(
                    department_pii=dept,
                    purchased_date__range=[start_date, end_date]
                )).count(),
                "total_expenditure": assets.aggregate(
                    total_expenditure=Sum("amount_purchased")
                )["total_expenditure"] or 0,
                "total_asset_type": (
                    Counter(assets.values_list("item_name_pii__item_name", flat=True)).most_common(1)[0][0]
                    if assets.exists() else "N/A"
                )
            }
            for dept in department_obj
        ]