from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from application.api.serializers import AssetViewModelSerializer, AssetViewListModelSerializer
from application.models import Asset
from rest_framework.permissions import IsAuthenticated
from dev.logger import log_message

# from dev.logger import log_message

class AssetViewAv(APIView):        
    def post(self, request):
        serializer = AssetViewModelSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # data you make on the serializer
        response_data = serializer.save()
        
        return Response(response_data, status=status.HTTP_201_CREATED)

# add a caching mechanism here
class AssetViewListAV(APIView):
    permission_classes = [IsAuthenticated]
    
    # filter assets using query_params
    def get(self, request):
        department_name = request.query_params.get("department")
        item_name = request.query_params.get("item_name")
        is_active = request.query_params.get("is_active")
        location = request.query_params.get("location")
        purchased_date = request.query_params.get("purchased_date")
        
        if not (
            department_name or
            item_name or 
            is_active or 
            location or
            purchased_date
        ): 
            assets = Asset.objects.all()
            serializer = AssetViewListModelSerializer(assets, many=True)
            
            # log_message(request.user)            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # if there are values within the department_name and item_name
        # Start with the base queryset
        assets = Asset.objects.select_related("department_pii", "item_name_pii", "location").all()
        
        if department_name:
            # Apply filters cumulatively
            assets = assets.filter(department_pii__department__iexact=department_name)
        if item_name:
            assets = assets.filter(item_name_pii__item_name__iexact=item_name)
        if is_active == "active":
            assets = assets.filter(is_active=True)
        if is_active == "retired":
            assets = assets.filter(is_active=False)
        if location:
            exact_word = location.strip()
            assets = assets.filter(location__name__iexact=exact_word)
        if purchased_date:
            assets = assets.filter(purchased_date=purchased_date)
        
        serializer = AssetViewListModelSerializer(assets, many=True)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        
        return response
        
class AssetBulkInsertAv(APIView):
    def post(self, request):
        serializer = AssetViewModelSerializer(data=request.data, many=True)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        response_data = serializer.save()
        
        return Response(response_data, status=status.HTTP_201_CREATED)