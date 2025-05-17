from rest_framework.views import APIView
from application.models import Asset
from application.api.serializers import DateRangeQuerySerializer
from application.api.pagination import BasePageNumberPagination
from application.api.views.helpers.helpers import convert_timestamp, generate_name, convert_datefield_to_datetime_field

class LabelGenerationLogAV(APIView):
    pagination_classes = BasePageNumberPagination
    
    def get(self, request):
        query_serializer = DateRangeQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        
        start_date = query_serializer.validated_data["start_date"]
        end_date = query_serializer.validated_data["end_date"]
        start_datetime, end_datetime = convert_datefield_to_datetime_field(start_date, end_date)
        response_data = self.generate_label_generation_log(start_datetime, end_datetime)
    
        return self.paginated_response(request, response_data)

    def paginated_response(self, request, response):
        paginator = self.pagination_classes()
        paginated_data = paginator.paginate_queryset(response, request, view=self)
        
        return paginator.get_paginated_response(paginated_data)
    
    def generate_label_generation_log(self, start_date, end_date):
        asset_obj = Asset.objects.select_related(
            "item_name_pii",
            "generated_by"
        ).filter(
            created_at__range=[start_date, end_date]
        )
        
        return [
            {
                "timestamp": convert_timestamp(asset.created_at),
                "asset_id": f"AST-{asset.asset_id}",
                "tag_type": asset.tag_type,
                "generated_by": generate_name(asset.generated_by),
                "remarks": asset.remarks  
            }
            for asset in asset_obj
        ]