from rest_framework_simplejwt.views import TokenObtainPairView
from application.api.serializers import CustomTokenObtainPairSerializer

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
        
#         # Update last_login manually
#         self.user.last_login = now()
#         self.user.save(update_fields=['last_login'])
        
#         return data

class CustomLoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer