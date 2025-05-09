from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from dev.logger import log_message

class IsFromDepartment(permissions.BasePermission):
    """
    Custom permission to check if the user is from a specific department.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False  # Unauthorized if the user is not authenticated

        # Now that we know the user is authenticated, check their department
        user = request.user
        # Log the department of the authenticated user
        log_message(user.department)

        # Example: Check if the user is in the "IT" department
        if user.department and user.department.name == "IT":
            return True
        
        return False

class TestView(APIView):
    permission_classes = [IsFromDepartment]
    
    def get(self, request):
        return Response({'msg': 'success'})
    
    
# sample code for caching
# from django.core.cache import cache
# from hashlib import md5
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .models import Asset
# from .serializers import AssetViewListModelSerializer
# from rest_framework import status

# class AssetViewListAV(APIView):

#     def get(self, request):
#         # Extract query parameters
#         department_name = request.query_params.get("department")
#         item_name = request.query_params.get("item_name")
#         is_active = request.query_params.get("is_active")
#         location = request.query_params.get("location")
#         purchased_date = request.query_params.get("purchased_date")
        
#         # Create a cache key based on query parameters
#         query_params = {
#             'department': department_name,
#             'item_name': item_name,
#             'is_active': is_active,
#             'location': location,
#             'purchased_date': purchased_date,
#         }
#         cache_key = f"assets_list_{md5(str(query_params).encode('utf-8')).hexdigest()}"
        
#         # Check if the cached response exists
#         cached_response = cache.get(cache_key)
#         if cached_response:
#             return cached_response
        
#         # If not cached, proceed with the database query and filtering
#         assets = Asset.objects.select_related("department_pii", "item_name_pii", "location").all()
        
#         if department_name:
#             assets = assets.filter(department_pii__department__iexact=department_name)
#         if item_name:
#             assets = assets.filter(item_name_pii__item_name__iexact=item_name)
#         if is_active == "active":
#             assets = assets.filter(is_active=True)
#         if is_active == "retired":
#             assets = assets.filter(is_active=False)
#         if location:
#             exact_word = location.strip()
#             assets = assets.filter(location__name__iexact=exact_word)
#         if purchased_date:
#             assets = assets.filter(purchased_date=purchased_date)
        
#         # Serialize the data
#         serializer = AssetViewListModelSerializer(assets, many=True)
#         response = Response(serializer.data, status=status.HTTP_200_OK)
        
#         # Cache the response for 15 minutes
#         cache.set(cache_key, response, timeout=60 * 15)  # Cache for 15 minutes
        
#         return response

