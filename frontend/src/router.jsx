import { createBrowserRouter } from "react-router-dom";
import App from "@pages/App";
import Base from "@layout/base";
import ErrorPage from "./pages/Error";
import AddAsset from "./pages/AddAsset";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Base />,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <App />
            },
            {
                path: "/add-asset",
                element: <AddAsset />
            }
        ],
    },
    {
        path: "/error",
        element: <ErrorPage />
    }
])

export default router;