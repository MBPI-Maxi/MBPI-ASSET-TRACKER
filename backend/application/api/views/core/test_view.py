from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from dev.logger import log_message
from rest_framework.permissions import IsAuthenticated
from datetime import date

class IsFromDepartment(permissions.BasePermission):
    """
    Custom permission to check if the user is from a specific department.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            # log_message(request.user)
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
    # permission_classes = [IsFromDepartment]
    # permission_classes = [IsAuthenticated]
    
    def get(self, request):
        purchased_date = date(2023, 11, 16)
        today = date(2025, 5, 16)


        asset_age_in_years = (today - purchased_date).days / 365
        return Response(asset_age_in_years)