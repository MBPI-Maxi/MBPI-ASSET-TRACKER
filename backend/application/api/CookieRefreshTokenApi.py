from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status

class CookieRefreshTokenApi(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        access_token_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        max_age = int(access_token_lifetime.total_seconds()) if access_token_lifetime else 3600 # 15 min or 1 hour
        
        refresh_token = request.COOKIES.get("refresh_token")
        
        if not refresh_token:
            return Response({"detail": "No refresh token in cookies."}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh_token_request = {
            "refresh": refresh_token
        }
        serializer = self.get_serializer(data=refresh_token_request)
        serializer.is_valid(raise_exception=True)
        
        access_token = serializer.validated_data["access"]
        
        response = Response({"refreshed": True}, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=settings.SECURE_COOKIE,
            samesite="Lax",
            max_age=max_age
        )
        
        return response
        