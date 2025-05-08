import { createBrowserRouter } from 'react-router-dom';
import CreateAsset from '../pages/CreateAsset';
import Layout from '../layout/Layout';
import GenerateQr from '../pages/GenerateQr';
import ErrorPage from '../pages/ErrorPage';
import FindAssetPage from '../pages/FindAssetPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // includes Navbar
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CreateAsset />,
      },
      {
        path: "generate_qr",
        element: <GenerateQr />
      },
      {
        path: "find",
        element: <FindAssetPage />
      }
    ]
  }
]);

export default router;
