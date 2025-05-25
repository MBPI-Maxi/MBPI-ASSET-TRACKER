import API_ROUTES from "@/api/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthProvider";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

function Logout() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timeoutId;

    async function doLogout() {
      try {
        await API_ROUTES.postLogout();  // Call backend to clear cookie/session
      } catch (error) {
        console.error("Logout API error:", error);

      } finally {
        // Clear auth state in frontend no matter what
        setIsAuthenticated(false);

        setOpen(true);

        timeoutId = setTimeout(() => {
          setOpen(false);
          navigate("/", { replace: true });
        }, 1500);
      }
    }

    doLogout();

    return () => clearTimeout(timeoutId);
  }, [setIsAuthenticated, navigate])

  return (
    <>
      {
        open &&
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1300,
            width: "auto",
            maxWidth: 400,
          }}
        >
          <Alert severity="success" variant="filled">
            Successfully logged out!
          </Alert>
        </Box>
      }
    </>
  )
}

export default Logout;