import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const showSnackbar = () => setOpenSnackbar(true);
  const hideSnackbar = () => setOpenSnackbar(false);

  return (
    <FormContext.Provider value={{
      errors,
      setErrors,
      openSnackbar,
      showSnackbar,
      hideSnackbar
    }}>
      {children}
    </FormContext.Provider>
  );
};
