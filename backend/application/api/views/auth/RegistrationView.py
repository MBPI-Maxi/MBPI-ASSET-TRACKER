from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from application.api.serializers import RegistrationViewSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegistrationAV(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # logic is within the RegistrationViewSerializer
        serializer = RegistrationViewSerializer(data=request.data)
        
        if serializer.is_valid():
            # serializer.save()
            # return Response(serializer.data, status=status.HTTP_200_OK)
            
            # you need to do this on manual way 
            user = serializer.save()
            # tokens = get_tokens_for_user(user)
            
            return Response({
                "msg": "Registration successful.",
                "data": serializer.data,
                # "tokens": tokens
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)