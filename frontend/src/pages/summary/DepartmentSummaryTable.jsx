import { useReducer, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker
} from '@mui/x-date-pickers';
import { RenderLoadingScreenTable } from '@pages/Skeleton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { ErrorFetching } from '../alerts';
import TableSummary from '@/components/summaryTable/TableSummary';
import API_ROUTES from '@/api/api';

function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_ROWS_PER_PAGE":
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "TRIGGER_FETCH":
      return { ...state, triggerFetch: state.triggerFetch + 1, page: 0 };
    case "RESET_HAS_SUBMITTED":
      return { ...state, hasSubmitted: false };
    default:
      return state;
  }
}

function DepartmentSummaryTable() {
  const [state, dispatch] = useReducer(reducer, {
    page: 0,
    rowsPerPage: 5,
    startDate: null,
    endDate: null,
    triggerFetch: 0,
  });

  const {
    openSnackbar,
    showSnackbar,
    hideSnackbar,
  } = useSnackBarContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "departmentSummary",
      state.page,
      state.rowsPerPage,
      state.startDate,
      state.endDate,
      state.triggerFetch
    ],
    queryFn: () =>
      API_ROUTES.getDeptPurchasedSummary({
        startDate: state.startDate,
        endDate: state.endDate,
        page: state.page + 1
      }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!state.startDate && !!state.endDate, // don't fetch if startdate and enddate is null
  })

  const handleChangePage = (event, newPage) => {
    dispatch({ type: "SET_PAGE", payload: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch({ type: "SET_ROWS_PER_PAGE", payload: parseInt(event.target.value, 10) });
  };

  const handleStartDateChange = (date) => {
    dispatch({ type: "SET_START_DATE", payload: date });

    if (date && state.endDate) {
      dispatch({ type: "TRIGGER_FETCH" });
    }
  };

  const handleEndDateChange = (date) => {
    dispatch({ type: "SET_END_DATE", payload: date });

    if (state.startDate && date) {
      dispatch({ type: "TRIGGER_FETCH" });
    }
  };

  useEffect(() => {
    if (isError) {
      showSnackbar();
    }
  }, [isError])

  const rows = data?.results || [];

  return (
    <Box>
      <Typography variant='body1' sx={{ mb: "30px" }}>
        Department Purchased Summary
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mb={2} display="flex" gap={2} alignItems="center">
          <DatePicker
            label="Start Date"
            value={state.startDate}
            onChange={(date) => handleStartDateChange(date)}
            slotProps={{
              textField: { size: "small" }
            }}
          />
          <DatePicker
            label="End Date"
            value={state.endDate}
            onChange={(date) => handleEndDateChange(date)}
            slotProps={{
              textField: { size: "small" }
            }}
          />
        </Box>

        {
          isLoading
            ? <RenderLoadingScreenTable />
            : (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableSummary data={rows}/>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={data?.count ?? 0}
                  page={state.page}
                  onPageChange={handleChangePage}
                  rowsPerPage={state.rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </>
            )}

      </LocalizationProvider>
      {
        openSnackbar &&
        <ErrorFetching
          openSnackbar={openSnackbar}
          hideSnackbar={hideSnackbar}
          msg="Error fetching department purchased summary"
        />
      }
    </Box>
  );
}

export default DepartmentSummaryTable;