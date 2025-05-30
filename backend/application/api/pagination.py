from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class BasePageNumberPagination(PageNumberPagination):
    page_size = 10
    # allow the frontend to control how many items are returned per page
    # GET /api/assets/?page=1&page_size=5
    page_size_query_param = "page_size"
    max_page_size = 50
    
class AssetVerificationScanPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 50
    
    def get_paginated_response(self, data):
        missing_assets = getattr(self, "missing_assets", None)
        total_missing_value = getattr(self, "total_missing_value", None)
        
        response_data = {
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data
        }
        
        if missing_assets is not None:
            response_data["missing_assets"] = missing_assets
        if total_missing_value is not None:
            response_data["total_missing_value"] = total_missing_value
            
        return Response(response_data)

class MaintenanceReportPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 50
    
    def get_paginated_response(self, data):
        total_maintenance_cost = getattr(self, "total_maintenance_cost", None)
        
        response_data = {
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data
        }
        
        if total_maintenance_cost is not None:
            response_data["total_maintenance_cost"] = total_maintenance_cost
        
        return Response(response_data)

class AssetViewPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 25

class DepartmentSummaryPagination(BasePageNumberPagination):
    page_size = 3
    max_page_size = 20
    
class DepreciationReportPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 30
    
    def get_paginated_response(self, data):
        total_depreciation_value = getattr(self, "total_depreciation_value", None)
        
        response_data = {
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data
        }

        # Only include total_depreciation_value if it was passed by the view
        if total_depreciation_value is not None:
            response_data["total_depreciation_value"] = total_depreciation_value

        return Response(response_data)