from rest_framework.pagination import PageNumberPagination

class BasePageNumberPagination(PageNumberPagination):
    page_size = 10
    # allow the frontend to control how many items are returned per page
    # GET /api/assets/?page=1&page_size=5
    page_size_query_param = "page_size"
    max_page_size = 50

class MaintenanceReportPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 50

class AssetViewPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 25

class DepartmentSummaryPagination(BasePageNumberPagination):
    page_size = 3
    max_page_size = 20
    
class DepreciationReportPagination(BasePageNumberPagination):
    page_size = 5
    max_page_size = 30