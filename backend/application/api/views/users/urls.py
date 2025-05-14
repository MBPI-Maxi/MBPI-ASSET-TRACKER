from django.urls import path
from application.api.views import (
    UserListAV,
    UserAv
)

app_name = "users_np"

urlpatterns = [
    path("users", UserListAV.as_view(), name="users_list"),
    path("user", UserAv.as_view(), name="user_av") # search only by username parameter
]
