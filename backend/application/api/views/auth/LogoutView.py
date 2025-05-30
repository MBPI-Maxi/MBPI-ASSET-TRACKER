from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from application.api.serializers import LogoutSerializer

# old code without access token and refresh in the response
# class LogoutAV(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = LogoutSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         refresh_token = serializer.validated_data["refresh"]

#         try:
#             token = RefreshToken(refresh_token)
#             token.blacklist()
            
#         except (TokenError, InvalidToken) as e:
#             return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#         return Response(status=status.HTTP_205_RESET_CONTENT)

class LogoutAV(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token is None:
            return Response({"detail": "No refresh token found in cookies."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (TokenError, InvalidToken) as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Clear both cookies
        response = Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie("access_token", path="/", samesite="Lax")
        response.delete_cookie("refresh_token", path="/", samesite="Lax")
        
        return response

