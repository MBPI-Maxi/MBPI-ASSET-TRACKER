from application.api.serializers import DepreciationReportSerializer, DepreciationReportListSerializer
from application.models import Asset
from application.api.pagination import DepreciationReportPagination
from application.api.views.helpers.helpers import straight_line_computation, double_declining_balance, sum_of_years_digits
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from decimal import Decimal

class DepreciationReportAV(APIView):
    _DEPRECIATION_METHOD = [
        "straight_line",
        "double_declining",
        "sum_of_years_digits"
    ]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = DepreciationReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # asset_id = self.compute_depreciation_rate(serializer.validated_data["asset_id"])
        asset_obj = serializer.validated_data["asset_id"]
        useful_life = serializer.validated_data["useful_life"]
        method = serializer.validated_data["method"]      
        
        result = self.compute_depreciation_rate(asset_obj, useful_life, method)
        
        return Response(result)
    
    def compute_depreciation_rate(self, asset_obj, useful_life, method):
        purchased_price = asset_obj.amount_purchased or 0
        # Calculate asset age in years (including fractions)
        purchased_date = asset_obj.purchased_date
        if not purchased_date:
            return "Purchase date unknown, cannot compute depreciation"
        
        today = date.today()
        asset_age_days = (today - purchased_date).days      
        asset_age_years = Decimal(asset_age_days) / Decimal(365)
                
        match method:
            case "straight_line":
                result = straight_line_computation(purchased_price, useful_life, asset_age_years)
                result["depreciation_method"] = self._DEPRECIATION_METHOD[0]
                return result
            case "double_declining":
                result = double_declining_balance(purchased_price, useful_life, asset_age_years)
                result["depreciation_method"] = self._DEPRECIATION_METHOD[1]
                return result
            case "sum_of_years_digits":
                result = sum_of_years_digits(purchased_price, useful_life, asset_age_years)
                result["depreciation_method"] = self._DEPRECIATION_METHOD[2]
                return result


class DepreciationReportListAV(APIView):
    pagination_classes = DepreciationReportPagination
    # permission_classes = [IsAuthenticated]
    
    def get_params(self, request):
        serializer = DepreciationReportListSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        useful_life = serializer.validated_data["useful_life"]
        method = serializer.validated_data["method"]
        
        return (
            useful_life,
            method
        )
    
    def get(self, request):
        useful_life, method = self.get_params(request)
        assets = Asset.objects.select_related("item_name_pii").all()
        results = []

        total_depreciation_value = Decimal(0)
        for asset in assets:
            if not asset.purchased_date or not asset.amount_purchased:
                continue
            
            purchased_price = asset.amount_purchased
            purchased_date = asset.purchased_date
            today = date.today()
            asset_age_days = (today - purchased_date).days
            asset_age_years = Decimal(asset_age_days) / Decimal(365)

            depreciation = self.compute_depreciation(
                purchased_price, useful_life, asset_age_years, method
            )
            # increment the total depreciation value
            total_depreciation_value += depreciation.get("depreciated_value", 0)
            
            depreciation["asset_id"] = asset.asset_id
            depreciation["item_name"] = asset.item_name_pii.item_name
            results.append(depreciation)

        # add the total depreciation value in the results
        # results.append({"total_depreciation_value": round(total_depreciation_value, 2)})

        return self.paginated_response(request, results, total_depreciation_value)
    
    def compute_depreciation(self, purchased_price, useful_life, asset_age_years, method):
        if method == "straight_line":
            result = straight_line_computation(purchased_price, useful_life, asset_age_years)
            result["depreciation_method"] = method
            result["useful_life"] = useful_life
            return result
        elif method == "double_declining":
            result = double_declining_balance(purchased_price, useful_life, asset_age_years)
            result["depreciation_method"] = method
            result["useful_life"] = useful_life
            return result
        elif method == "sum_of_years_digits":
            result = sum_of_years_digits(purchased_price, useful_life, asset_age_years)
            result["depreciation_method"] = method
            result["useful_life"] = useful_life
            return result
    
    def paginated_response(self, request, response, total_depreciation_value):
        paginator = self.pagination_classes()
        paginator.total_depreciation_value = round(total_depreciation_value, 2)
        paginated_data = paginator.paginate_queryset(response, request, view=self)
        
        return paginator.get_paginated_response(paginated_data)
