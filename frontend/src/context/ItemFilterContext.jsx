// AssetFilterContext.js
import { useContext, createContext, useState, useRef, useCallback } from "react";
import useAssetQuery from "../api/assetList";

const AssetFilterContext = createContext();

export function AssetFilterContextProvider({ children }) {
  const [item, setItem] = useState(""); 
  const [filters, setFilters] = useState(null);

  const departmentRef = useRef();
  const statusRef = useRef(); 

  const query = useAssetQuery(filters);

  const handleClick = useCallback(() => {
    const department = departmentRef.current.value;
    const status = statusRef.current.value;

    const newPayload = {
      item_name: item,
      department,
      status
    };

    if (department === "department") delete newPayload.department;
    // if (status === "status") delete newPayload.status;

    setFilters(newPayload);

    // Use a small timeout to wait for state update
    setTimeout(() => {
      query.refetch();
    }, 0);
  }, [item, query]);

  return (
    <AssetFilterContext.Provider value={{
      item,
      setItem,
      filters,
      setFilters,
      departmentRef,
      statusRef,
      query,
      handleClick
    }}>
      {children}
    </AssetFilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(AssetFilterContext);
}
