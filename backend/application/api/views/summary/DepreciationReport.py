from rest_framework.views import APIView
from rest_framework.response import Response
from application.api.serializers import DepreciationReportSerializer
from application.models import Asset
from dev.logger import log_message
from datetime import date

class DepreciationReportAV(APIView):
    def post(self, request):
        serializer = DepreciationReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # asset_id = self.compute_depreciation_rate(serializer.validated_data["asset_id"])
        asset_obj = serializer.validated_data["asset_id"]
        useful_life = serializer.validated_data["useful_life"]
        method = serializer.validated_data["method"]      
        
        testing = self.compute_depreciation_rate(asset_obj, useful_life, method)
        log_message(testing)
        return Response(serializer.data)
    
    def compute_depreciation_rate(self, asset_obj, useful_life, method):
        purchased_price = asset_obj.amount_purchased or 0
        
        # Calculate asset age in years (including fractions)
        purchased_date = asset_obj.purchased_date
        if not purchased_date:
            return "Purchase date unknown, cannot compute depreciation"
        
        today = date.today()
        asset_age_days = (today - purchased_date).days        
        asset_age_years = asset_age_days / 365
        
        log_message(asset_age_years)
        match method:
            case "straight_line":
                return "working"
        
        
    