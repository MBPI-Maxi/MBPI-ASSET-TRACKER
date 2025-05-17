from django.urls import path
from application.api.views import (
    DepartmentPurchasedSummary, 
    AssetScanVerificationReportAV,
    LabelGenerationLogAV,
    MaintenanceReportListAV,
    MaintenanceReportAV,
    DepreciationReportAV,
    DepreciationReportListAV
)  

app_name = "summary_np"

urlpatterns = [
    path("dept-purchased-summary", DepartmentPurchasedSummary.as_view(), name="department_summary_av"),
    path("scan-verification-report", AssetScanVerificationReportAV.as_view(), name="asset_scan_verification_av"),
    path("label-generation-log", LabelGenerationLogAV.as_view(), name="label_generation_log_av"),
    path("maintenance-report", MaintenanceReportAV.as_view(), name="maintenance_report_av"),
    path("maintenance-report/list", MaintenanceReportListAV.as_view(), name="maintenance_report_list_av"),
    path("depreciation-report", DepreciationReportAV.as_view(), name="depreciation_report_av"),
    path("depreciation-report/list", DepreciationReportListAV.as_view(), name="depreciation_report_list_av"),
]
