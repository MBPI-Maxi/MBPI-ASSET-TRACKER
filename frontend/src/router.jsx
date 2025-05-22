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

// provider
import { SnackbarProvier } from "./context/SnackBarProvider";
import { QRCodeProvider } from "./context/QRCodeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    element: <App />,
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
          <SnackbarProvier>
            <QRCodeProvider>
              <QRCode />
            </QRCodeProvider>
          </SnackbarProvier>
        )
      },
      {
        path: "summary/department-purchased",
        element: (
          <SnackbarProvier>
            <DepartmentSummaryTable />
          </SnackbarProvier>
        )
      },
    ]
  }
])

export default router;