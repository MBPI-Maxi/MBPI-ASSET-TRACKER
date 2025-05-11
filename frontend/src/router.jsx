import { createBrowserRouter } from "react-router-dom";
import App from "@pages/App";
import Base from "@layout/base";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Base />,
        children: [
            {
                index: true,
                element: <App />
            }
        ]
    }
])

export default router;