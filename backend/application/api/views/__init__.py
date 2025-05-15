# core
from application.api.views.core.asset_view import (
    AssetViewAv,
    AssetViewListAV,
    AssetBulkInsertAv,
) 

# for testing purposes
from application.api.views.core.test_view import (
    TestView
)

# summary
from application.api.views.summary.DepartmentPurchasedSummary import (
    DepartmentPurchasedSummary,
)
from application.api.views.summary.AssetScanVerificationReport import (
    AssetScanVerificationReportAV
)
from application.api.views.summary.LabelGenerationLog import (
    LabelGenerationLogAV
)


# auth
from application.api.views.auth.RegistrationView import (
    RegistrationAV
)
from application.api.views.auth.LogoutView import (
    LogoutAV
)

from application.api.views.auth.LoginView import (
    CustomLoginTokenObtainPairView
)
from application.api.views.users.UserView import (
    UserListAV,
    UserAv
)

