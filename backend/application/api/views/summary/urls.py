from django.urls import path
from application.api.views import DepartmentPurchasedSummary, AssetScanVerificationReportAV, LabelGenerationLogAV

app_name = "summary_np"

urlpatterns = [
    path("dept-purchased-summary", DepartmentPurchasedSummary.as_view(), name="department_summary"),
    path("scan-verification-report", AssetScanVerificationReportAV.as_view(), name="asset_scan_verification"),
    path("label-generation-log", LabelGenerationLogAV.as_view(), name="label_generation_log")
]
