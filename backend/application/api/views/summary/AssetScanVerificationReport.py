from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from application.api.serializers import DateRangeQuerySerializer
from application.api.pagination import AssetVerificationScanPagination
from application.api.views.helpers.helpers import convert_datefield_to_datetime_field, convert_timestamp, generate_name
from application.models import Asset
from django.db.models import Q
from django.utils import timezone


# list view serializer
class AssetScanVerificationReportAV(APIView):
    # permission_classes = [IsAuthenticated]
    pagination_classes = AssetVerificationScanPagination
    
    def get(self, request):
        query_serializer = DateRangeQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        
        start_date = query_serializer.validated_data["start_date"]
        end_date = query_serializer.validated_data["end_date"]
        
        # convert the start_date and end_date to a datetimefield because updated_at column is datetimefield
        start_datetime, end_datetime = convert_datefield_to_datetime_field(start_date, end_date)
        
        report_data = self.generate_scan_verification_report(start_datetime, end_datetime)
        
        return self.paginated_response(
            request, 
            report_data,
            missing_assets=report_data["missing_assets"],
            total_missing_value=report_data["total_missing_value"]
        )
    
    def paginated_response(self, request, response, missing_assets, total_missing_value):
        paginator = self.pagination_classes()
        
        data = response["data"]
        paginated_data = paginator.paginate_queryset(data, request, view=self)
        
        paginator.missing_assets = missing_assets
        paginator.total_missing_value = total_missing_value
                
        return paginator.get_paginated_response(paginated_data)
      
    def generate_scan_verification_report(self, start_date, end_date):
        # asset_obj = Asset.objects.select_related(
        #     "item_name_pii", 
        #     "department_pii", 
        #     "location", 
        #     "generated_by", 
        #     "updated_by"
        # ).filter(updated_at__range=[start_date, end_date])
        asset_obj = Asset.objects.select_related(
            "item_name_pii", 
            "department_pii", 
            "location", 
            "generated_by", 
            "updated_by"
        ).filter(
            Q(updated_at__range=[start_date, end_date]) | Q(is_found=False)
        )
        
        misset_assets = []
        result = []
        today = timezone.now()
        
        # testing purposes
        # from datetime import datetime
        # today = timezone.make_aware(datetime(2025, 5, 30, 12, 0, 0))
        
        for asset in asset_obj:
            days_missing = 0
            
            if not asset.is_found:
                amount = asset.amount_purchased or 0
                misset_assets.append(amount)
                
                days_missing = (today - asset.updated_at).days
            
            result.append({
                "asset_id": f"AST-{asset.asset_id}",
                "item_name": asset.item_name_pii.item_name,
                "expected_location": asset.location.name,
                "status": "Found" if asset.is_found else "Missing",
                "last_seen": convert_timestamp(asset.updated_at),
                "generated_by": generate_name(asset.generated_by),
                "updated_by": generate_name(asset.updated_by),
                "value": str(asset.amount_purchased or 0),
                "days_missing": days_missing,
            })
        
        return {
            "missing_assets": len(misset_assets),
            "total_missing_value": str(sum(misset_assets)),
            "data": result
        }