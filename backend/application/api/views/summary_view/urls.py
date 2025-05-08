from django.urls import path
from application.api.views import DepartmentPurchasedSummary

app_name = "summary_np"

urlpatterns = [
    path("dept-purchased-summary", DepartmentPurchasedSummary.as_view(), name="department_summary")
]
