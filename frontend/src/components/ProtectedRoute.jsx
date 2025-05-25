import { useAuthContext } from "@/context/AuthProvider";
import { Navigate } from "react-router-dom";
// import { CircularProgress, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  // if (isAuthenticated === null) {
  //   return (
  //     <Box display="flex" justifyContent="center" mt={10}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
