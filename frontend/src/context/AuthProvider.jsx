import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_ROUTES from "@/api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [loading, setLoading] = useState(true);
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await API_ROUTES.postIsAuthenticated();
        setIsAuthenticated(res); // assuming boolean response

      } catch (error) {
        console.error("Auth check failed:", error);

        setIsAuthenticated(false);
        
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);
  // }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
      { children }
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);