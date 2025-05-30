// this is a standalone snack bar provider if you have no forms etc.
import {
  createContext,
  useContext,
  useState
} from "react";

const QRCodeContext = createContext();

export const useQRCodeContext = () => useContext(QRCodeContext);

export function QRCodeProvider({ children }) {
  const [page, setPage] = useState(0); // zero-indexed
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    item_name: "",
    department: "",
    is_active: "",
    location: "",
    purchased_date: "",
  });

  // individual context
  const [department, setDepartment] = useState("");
  const [is_active, setIsActive] = useState("");
  const [location, setLocation] = useState("");
  const [purchased_date, setPurchasedDate] = useState("");

  const context = {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    inputValue,
    setInputValue,
    searchFilters,
    setSearchFilters,
    department,
    setDepartment,
    is_active,
    setIsActive,
    location,
    setLocation,
    purchased_date,
    setPurchasedDate
  }
  
  return (
    <QRCodeContext.Provider value={context}>
      { children }
    </QRCodeContext.Provider>
  );
}