import { createBrowserRouter } from "react-router-dom";
import App from "@pages/App";
import Base from "@layout/base";
import ErrorPage from "./pages/Error";
import AddAsset from "./pages/AddAsset";
import QRPage from "./pages/QRPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Base />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "/asset/add",
        element: <AddAsset />
      },
      {
        path: "/qr/codes",
        element: <QRPage />
      }
    ],
  },
  {
    path: "/error",
    element: <ErrorPage />
  }
])

export default router;