from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from application.api.serializers import MaintenanceReportSerializer, MaintenanceReportListSerializer
from application.api.pagination import MaintenanceReportPagination
from application.models import AssetMaintenance
from dev.logger import log_message
from django.db.models import Sum

# from django.utils.decorators import method_decorator
# from django.views.decorators.cache import cache_page
# from django.views.decorators.vary import vary_on_cookie, vary_on_headers

class MaintenanceReportListAV(APIView):
    # get for search by asset ID
    # @method_decorator(cache_page(60 * 60 * 2))
    # @method_decorator(vary_on_headers("Authorization"))
    def get(self, request):
        log_message("MaintenanceReportListAV GET method executed")
        
        maintenance_qs = AssetMaintenance.objects.all().order_by("created_at")
        total_cost = self.calculate_total_maintenance_cost(maintenance_qs)
        
        paginator = MaintenanceReportPagination()
        result_page = paginator.paginate_queryset(maintenance_qs, request)
        serializer = MaintenanceReportListSerializer(result_page, many=True)
        
        paginated_response = paginator.get_paginated_response(serializer.data)
        paginated_response.data.setdefault(
            "total_maintenance_cost",
            str(total_cost)
        )
        
        return paginated_response
    
    def calculate_total_maintenance_cost(self, queryset):
        total_cost = queryset.aggregate(
            total_maintenance_cost=Sum("cost")
        )["total_maintenance_cost"] or 0
        
        return total_cost

class MaintenanceReportAV(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = MaintenanceReportSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    