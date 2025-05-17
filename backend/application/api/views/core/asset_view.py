from application.api.serializers import AssetViewModelSerializer, AssetViewListModelSerializer, AssetViewModelGetSingleSerializer
from application.api.pagination import AssetViewPagination
from application.api.views.helpers.helpers import create_pagination
from application.models import Asset
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from dev.logger import log_message


class AssetViewAv(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = AssetViewModelSerializer(data=request.data, context={ "request": request })
        
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        try:
            asset = Asset.objects.get(asset_id=pk)
        except Asset.DoesNotExist:
            return Response({"Detail": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # pass the request object on the serializer to put the current user who updated it and save to the db
        serializer = AssetViewModelSerializer(
            asset, 
            data=request.data, 
            context={ "request": request }
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get(self, request, pk):
        try:
            asset = Asset.objects.get(asset_id=pk)  
        except Asset.DoesNotExist:
            return Response(
                {"error": "Asset does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        else:
            serializer = AssetViewModelGetSingleSerializer(asset, data=request.data)
            
            if serializer.is_valid():
                copy_serializer = serializer.data.copy()
                
                qr_code_image_path = serializer.data.get("qr_code_image")
                full_path_to_qr_code = f"{settings.LOCAL_SERVER}{qr_code_image_path}"
                copy_serializer["qr_code_image"] = full_path_to_qr_code
                                
                return Response(copy_serializer, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            asset = Asset.objects.get(asset_id=pk)
        except Asset.DoesNotExist:
            return Response({"detail": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

        # Delete the QR code image file if exists
        if asset.qr_code_image and default_storage.exists(asset.qr_code_image.name):
            default_storage.delete(asset.qr_code_image.name)
        
        asset.delete()
        return Response({"msg": "Successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
            
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
            assets = Asset.objects.all().order_by("asset_id")
            
            response = create_pagination(
                page_instance=AssetViewPagination, 
                serializer_instance=AssetViewListModelSerializer, 
                queryset=assets, 
                request_object=request, 
                view_instance=self
            )
            
            return response
           
        # if there are values within the department_name and item_name
        # Start with the base queryset (sql joins syntax)
        assets = Asset.objects.select_related("department_pii", "item_name_pii", "location").all().order_by("asset_id")
        
        # filters
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
        
        response = create_pagination(
            page_instance=AssetViewPagination,
            serializer_instance=AssetViewListModelSerializer,
            queryset=assets,
            request_object=request,
            view_instance=self
        )
        
        return response
        
class AssetBulkInsertAv(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = AssetViewModelSerializer(data=request.data, many=True)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        response_data = serializer.save()
        
        return Response(response_data, status=status.HTTP_201_CREATED)