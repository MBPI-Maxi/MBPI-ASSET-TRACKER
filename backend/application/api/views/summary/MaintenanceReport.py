from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated
from application.api.serializers import MaintenanceReportSerializer, MaintenanceReportListSerializer, MaitenanceReportDetailSerializer
from application.api.pagination import MaintenanceReportPagination
from application.api.serializers import DateRangeQuerySerializer
from application.models import AssetMaintenance
from application.api.filters import MaintenanceCustomDateFilterBackend
from django.db.models import Sum

# from django.utils.decorators import method_decorator
# from django.views.decorators.cache import cache_page
# from django.views.decorators.vary import vary_on_cookie, vary_on_headers

class MaintenanceReportListAV(APIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [MaintenanceCustomDateFilterBackend]
    
    # get for search by asset ID
    # @method_decorator(cache_page(60 * 60 * 2))
    # @method_decorator(vary_on_headers("Authorization"))
    def get(self, request):
        date_serializer = DateRangeQuerySerializer(data=request.query_params)
        date_serializer.is_valid(raise_exception=True)
        
        maintenance_qs = AssetMaintenance.objects.all().order_by("created_at")
        maintenance_qs = self.filter_by_date(request, maintenance_qs)
        
        total_cost = self.calculate_total_maintenance_cost(maintenance_qs)
        
        paginator = MaintenanceReportPagination()
        paginator.total_maintenance_cost = str(total_cost)
        
        result_page = paginator.paginate_queryset(maintenance_qs, request)
        serializer = MaintenanceReportListSerializer(result_page, many=True)
        
        paginated_response = paginator.get_paginated_response(serializer.data)
        
        return paginated_response
    
    def calculate_total_maintenance_cost(self, queryset):
        total_cost = queryset.aggregate(
            total_maintenance_cost=Sum("cost")
        )["total_maintenance_cost"] or 0
        
        return total_cost

    def filter_by_date(self, request, queryset):
        for backend in self.filter_backends:
            queryset = backend().filter_queryset(request, queryset, view=self)
        return queryset

class MaintenanceReportAV(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = MaintenanceReportSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        try:
            report_instance = AssetMaintenance.objects.get(maintenance_id=pk)
            serializer = MaitenanceReportDetailSerializer(report_instance)
        except AssetMaintenance.DoesNotExist:
            return Response({
                "detail": "Maintenance report not found"
            }, status=status.HTTP_404_NOT_FOUND)            
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)
    