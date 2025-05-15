from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from application.models import Asset
from application.api.serializers import DateRangeQuerySerializer
from application.api.views.helpers.helpers import convert_timestamp, generate_name

class LabelGenerationLogAV(APIView):
    def get(self, request):
        query_serializer = DateRangeQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        
        start_date = query_serializer.validated_data["start_date"]
        end_date = query_serializer.validated_data["end_date"]
        
        response = self.generate_label_generation_log(start_date, end_date)
        
        return Response(response, status=status.HTTP_200_OK)
        
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
        