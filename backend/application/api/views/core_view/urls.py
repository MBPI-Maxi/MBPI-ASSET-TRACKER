
from django.urls import path
from application.api.views import AssetViewAv

app_name = "asset_np"

urlpatterns = [
    path("asset", AssetViewAv.as_view(), name="asset_av")
]