from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from application.api.serializers import CustomTokenObtainPairSerializer
from django.conf import settings

class CustomLoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    # for httpOnly 
    def post(self, request, *args, **kwargs):
        access_token_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        max_age = int(access_token_lifetime.total_seconds()) if access_token_lifetime else 3600
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tokens = {
            "access": serializer.validated_data["access"],
            "refresh": serializer.validated_data["refresh"]
        }

        user_details = serializer.validated_data["user_details"]

        response = Response(
            {"user_details": user_details},
            status=status.HTTP_200_OK
        )

        # Set cookies
        response.set_cookie(
            key="access_token",
            value=tokens["access"],
            httponly=True,
            secure=settings.SECURE_COOKIE,  # Set to True in production with HTTPS
            samesite="Lax",
            # max_age=max_age,
            max_age=86400, # 1 day
            path="/"
        )
        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=settings.SECURE_COOKIE, # Set to True in production with HTTPS
            samesite="Lax",
            max_age=7 * 24 * 3600, # 7 days
            path="/"
        )

        return response