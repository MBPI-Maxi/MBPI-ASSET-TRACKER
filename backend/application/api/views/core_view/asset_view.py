from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from application.api.serializers import AssetViewModelSerializer, AssetViewListModelSerializer
from application.models import Asset
from dev.logger import log_message

class AssetViewAv(APIView):        
    def post(self, request):
        serializer = AssetViewModelSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # data you make on the serializer
        response_date = serializer.save()
        
        return Response(response_date, status=status.HTTP_201_CREATED)

class AssetViewListAV(APIView):
    def get(self, request):
        # # Fetch assets and related fields efficiently
        # assets = Asset.objects.select_related("item_name_pii", "department_pii").all()
        # serializer = AssetViewModelSerializer(assets, many=True)

        # # fetch the column based on relationship
        # custom_data = [
        #     {
        #         "department": asset.department_pii.department,
        #         "item_name": asset.item_name_pii.item_name
        #     }
        #     for asset in assets
        # ]       
        
        # return Response({
        #     "data": serializer.data,
        #     "related_data": custom_data
        # }, status=status.HTTP_200_OK) 
        
        # Fetch assets and related fields efficiently
        assets = Asset.objects.all()
        serializer = AssetViewListModelSerializer(assets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)