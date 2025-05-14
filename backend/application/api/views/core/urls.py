
from django.urls import path
from application.api.views import AssetViewAv, AssetViewListAV, AssetBulkInsertAv, TestView

app_name = "asset_np"

urlpatterns = [
    path("asset", AssetViewAv.as_view(), name="asset_av"),
    path("asset/asset-id/<int:pk>", AssetViewAv.as_view(), name="asset_put_av"),
    path("asset/list", AssetViewListAV.as_view(), name="asset_list_av"),
    path("asset/bulkinsert", AssetBulkInsertAv.as_view(), name="asset_bulk_insert_av"),
    
    
    
    path("test", TestView.as_view(), name="test_av")
]