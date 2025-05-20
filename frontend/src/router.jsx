import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error";
import LandingPage from "./pages/LandingPage";

// core
import Core from "./pages/core/Core";
import AddAsset from "./pages/core/AddAsset";
import WelcomePage from "./pages/core/WelcomePage";
import UpdateAsset from "./pages/core/UpdateAsset";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    element: <Core />,
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
        path: "asset/update",
        element: <UpdateAsset />
      }
    ]
  }
])


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Base />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         element: <App />
//       },
//       {
//         path: "/asset/add",
//         element: <AddAsset />
//       },
//       {
//         path: "/qr/codes",
//         element: <QRPage />
//       }
//     ],
//   },
//   {
//     path: "/error",
//     element: <ErrorPage />
//   }
// ])

export default router;