import { createContext, useContext, useReducer } from "react";

const FilterContext = createContext();

const initialState = {
  page: 0,
  rowsPerPage: 5,
  startDate: null,
  endDate: null,
  triggerFetch: 0,
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'TRIGGER_FETCH':
      return { ...state, triggerFetch: state.triggerFetch + 1, page: 0 };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(FilterContext);
}