import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error";
import LandingPage from "./pages/LandingPage";

// main
import App from "@pages/App";

// core
import AddAsset from "./pages/core/AddAsset";
import WelcomePage from "./pages/core/WelcomePage";
import UpdateAsset from "./pages/core/UpdateAsset";
import QRCode from "./pages/core/QRCode";
import DepartmentSummaryTable from "./pages/summary/DepartmentSummaryTable";
import AssetScanVerificationTable from "./pages/summary/AssetScanVerificationTable";
import LabelGenerationTable from "./pages/summary/LabelGenerationTable";
import DepreciationTable from "./pages/depreciation/DepreciationTable";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import MaintenanceReport from "./pages/core/MaintenanceReport";
import MaintenanceReportTable from "./pages/summary/MaintenanceReportTable";
import Logout from "./pages/auth/Logout";

// provider
import { SnackbarProvider } from "./context/SnackBarProvider";
import { QRCodeProvider } from "./context/QRCodeContext";

const router = createBrowserRouter([
  {
    element: <AuthLayout />, // ✅ AuthProvider wraps everything here
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/app",
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <WelcomePage />
          },
          {
            path: "asset/add",
            element: <AddAsset />
          },
          {
            path: "asset/manage",
            element: <UpdateAsset />
          },
          {
            path: "qrcode/view",
            element: (
              <SnackbarProvider>
                <QRCodeProvider>
                  <QRCode />
                </QRCodeProvider>
              </SnackbarProvider>
            )
          },
          {
            path: "summary/department-purchased",
            element: (
              <SnackbarProvider>
                <DepartmentSummaryTable />
              </SnackbarProvider>
            )
          },
          {
            path: "summary/asset-scan-verification",
            element: (
              <SnackbarProvider>
                <AssetScanVerificationTable />
              </SnackbarProvider>
            )
          },
          {
            path: "summary/label-generation",
            element: (
              <SnackbarProvider>
                <LabelGenerationTable />
              </SnackbarProvider>
            )
          },
          {
            path: "summary/depreciation/report",
            element: (
              <SnackbarProvider>
                <DepreciationTable />
              </SnackbarProvider>
            )
          },
          {
            path: "summary/maintenance/add",
            element: (
              <SnackbarProvider>
                <MaintenanceReport />
              </SnackbarProvider>
            )
          },
          {
            path: "summary/maintenance/list",
            element: (
              <SnackbarProvider>
                <MaintenanceReportTable />
              </SnackbarProvider>
            )
          }
        ]
      },
      {
        path: "logout",
        element: <Logout />
      }
    ]
  }
]);

export default router;