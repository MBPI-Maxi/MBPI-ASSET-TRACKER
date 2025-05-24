from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from application.api.serializers import CustomTokenObtainPairSerializer

class CustomLoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    # for httpOnly 
    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)

    #     tokens = {
    #         "access": serializer.validated_data["access"],
    #         "refresh": serializer.validated_data["refresh"]
    #     }

    #     user_details = serializer.validated_data["user_details"]

    #     response = Response(
    #         {"user_details": user_details},
    #         status=status.HTTP_200_OK
    #     )

    #     # Set cookies
    #     response.set_cookie(
    #         key='access_token',
    #         value=tokens['access'],
    #         httponly=True,
    #         secure=False,  # Set to True in production with HTTPS
    #         samesite='Lax',
    #         max_age=3600
    #     )
    #     response.set_cookie(
    #         key='refresh_token',
    #         value=tokens['refresh'],
    #         httponly=True,
    #         secure=False, # Set to True in production with HTTPS
    #         samesite='Lax',
    #         max_age=7 * 24 * 3600
    #     )

    #     return response