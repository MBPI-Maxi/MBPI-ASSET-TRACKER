from django.urls import path
from application.api.views import (
    RegistrationAV,
    LogoutAV,
    CustomLoginTokenObtainPairView,
)

app_name = "registration_np"

urlpatterns = [
    path("registration", RegistrationAV.as_view(), name="user_registration"),
    path("logout", LogoutAV.as_view(), name="user_logout"),
    path("login", CustomLoginTokenObtainPairView.as_view(), name="user_login")
]
