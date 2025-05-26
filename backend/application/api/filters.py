from rest_framework.filters import BaseFilterBackend

class AssetCustomFilterBackend(BaseFilterBackend):
    def apply_boolean_filters(self, column_name: str, param: str, queryset):
        if column_name == "is_active":
            if param.lower() == "active":
                queryset = queryset.filter(is_active=True)
            elif param.lower() == "retired":
                queryset = queryset.filter(is_active=False)
        elif column_name == "is_found":
            if param.lower() == "found":
                queryset = queryset.filter(is_found=True)
            elif param.lower() == "missing":
                queryset = queryset.filter(is_found=False)
        
        return queryset
        
    
    def filter_queryset(self, request, queryset, view):
        params = request.query_params

        department = params.get("department")
        item_name = params.get("item_name")
        is_active = params.get("is_active")
        location = params.get("location")
        purchased_date = params.get("purchased_date")
        is_found = params.get("is_found")
        
        if department:
            queryset = queryset.filter(department_pii__department__iexact=department)
        if item_name:
            queryset = queryset.filter(item_name_pii__item_name__iexact=item_name)
            
        if is_active:
            queryset = self.apply_boolean_filters("is_active", is_active, queryset)
                
        if location:
            queryset = queryset.filter(location__name__iexact=location)
            
        if purchased_date:
            queryset = queryset.filter(purchased_date=purchased_date)
            
        if is_found:
            queryset = self.apply_boolean_filters("is_found", is_found, queryset)

        return queryset
    
class MaintenanceCustomDateFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        params = request.query_params
        start_date = params.get("start_date")
        end_date = params.get("end_date")
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        return queryset
