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


# auth
from application.api.views.auth.RegistrationView import (
    RegistrationAV
)
from application.api.views.auth.LogoutView import (
    LogoutAV
)
