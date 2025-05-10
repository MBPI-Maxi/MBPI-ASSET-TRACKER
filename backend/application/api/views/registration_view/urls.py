from django.urls import path
from application.api.views import RegistrationAV

app_name = "registration_np"

urlpatterns = [
    path("registration", RegistrationAV.as_view(), name="user_registration")
]
