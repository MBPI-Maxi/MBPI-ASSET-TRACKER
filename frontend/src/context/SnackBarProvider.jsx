// this is a standalone snack bar provider if you have no forms etc.
import {
  createContext,
  useContext,
  useState
} from "react";

const SnackbarContext = createContext();

export const useSnackBarContext = () => useContext(SnackbarContext);

export function SnackbarProvider({ children }) {
  const [ openSnackbar, setOpenSnackbar ] = useState(false);
  const showSnackbar = () => setOpenSnackbar(true);
  const hideSnackbar = () => setOpenSnackbar(false);
  
  return (
    <SnackbarContext.Provider value={{
      openSnackbar,
      showSnackbar,
      hideSnackbar,
      setOpenSnackbar
    }}>
      { children }
    </SnackbarContext.Provider>
  );
}