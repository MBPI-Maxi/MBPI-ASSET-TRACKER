import { useReducer, useRef, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ErrorFetching } from '@/pages/alerts';
import {
  Table,
  TableContainer,
  Paper,
  TablePagination,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button
} from '@mui/material';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useReactToPrint } from 'react-to-print';
import { PrintButton, ExportToExcel } from '@/components/summaryTable/customButtonHelpers';
import { DEPRECIATION_METHODS } from '@/constants/backendData';
import { addCommasToNumber } from '@/helpers/helper';
import { RenderLoadingScreenTable } from '@/pages/Skeleton';
import TableSummary from '@/components/summaryTable/TableSummary';

function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_ROWS_PER_PAGE":
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case "SET_METHOD":
      return { ...state, method: action.payload };
    case "SET_USEFUL_LIFE":
      return { ...state, usefulLife: action.payload };
    case "SET_BUTTON_TRIGGER":
      return { ...state, buttonHasClicked: true, triggerFetch: state.triggerFetch + 1 };
    case "RESET_BUTTON_TRIGGER":
      return { ...state, buttonHasClicked: false };
    default:
      return state;
  }
}

function DepreciationLayout({
  title,
  apiFunc,
  endpoint,
  nameSummaryReport,
  queryKeyString,
  snackBarMessage,
  fileNameStr,
}) {
  const componentRef = useRef();
  const [state, dispatch] = useReducer(reducer, {
    page: 0,
    rowsPerPage: 5,
    method: 'straight_line',
    usefulLife: '',
    triggerFetch: 0,
    buttonHasClicked: false
  });

  const { openSnackbar, showSnackbar, hideSnackbar } = useSnackBarContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "depreciationSummary",
      state.page,
      state.rowsPerPage,
      state.triggerFetch
    ],
    queryFn: () => {
      if (!state.usefulLife) {
        return Promise.resolve({ results: [], count: 0 });
      }

      return apiFunc({
        method: state.method,
        usefulLife: state.usefulLife,
        rowsPerPage: state.rowsPerPage,
        page: state.page + 1,
        endpoint,
        queryKeyString,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: state.buttonHasClicked && !!state.usefulLife,
  });

  const handleChangePage = (event, newPage) => {
    dispatch({ type: "SET_PAGE", payload: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch({ type: "SET_ROWS_PER_PAGE", payload: parseInt(event.target.value, 10) });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef
  });

  const rows = data?.results || [];

  useEffect(() => {
    if (isError) {
      showSnackbar();
    }
  }, [isError, showSnackbar])

  useEffect(() => {
    if (state.buttonHasClicked && !isLoading && !isError) {
      dispatch({ type: "RESET_BUTTON_TRIGGER" });
    }

    if (state.buttonHasClicked && isError) {
      dispatch({ type: "RESET_BUTTON_TRIGGER" });
    }
  }, [isLoading, isError, state.buttonHasClicked]);

  return (
    <Box>
      <Typography variant='body1' sx={{ mb: "30px" }}>
        {title}
      </Typography>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField
          select
          label="Depreciation Method"
          value={state.method}
          onChange={(e) => dispatch({ type: "SET_METHOD", payload: e.target.value })}
          size="small"
        >
          {
            DEPRECIATION_METHODS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label="Useful Life (years)"
          type="number"
          size="small"
          value={state.usefulLife}
          onChange={(e) => dispatch({ type: "SET_USEFUL_LIFE", payload: e.target.value })}
          slotProps={{
            htmlInput: { min: 1 }
          }}
        />

        <Button variant="contained" onClick={() => dispatch({ type: "SET_BUTTON_TRIGGER" })}>
          Compute
        </Button>
      </Box>

      {
        isLoading
          ? <RenderLoadingScreenTable />
          : (
            <>
              <Box display="flex" gap={2} mb={2}>
                <PrintButton handlePrint={handlePrint} />
                <ExportToExcel data={rows} fileName={fileNameStr || "depreciation-report"} exportType="xls" />
              </Box>

              <Box ref={componentRef} sx={{ mb: 2 }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableSummary data={rows} nameSummaryReport={nameSummaryReport} />
                  </Table>
                </TableContainer>
              </Box>

              {
                data?.total_depreciation_value && 
                <Box>
                  {/* <strong>Total Depreciation Value: </strong> */}
                  <Typography fontWeight={700}>
                    Total Depreciation Value: { addCommasToNumber(data.total_depreciation_value) }
                  </Typography>
                </Box>
              }
              
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
          )
      }

      {
        openSnackbar && (
          <ErrorFetching
            openSnackbar={openSnackbar}
            hideSnackbar={hideSnackbar}
            msg={snackBarMessage || "Error Fetching Depreciation Data"}
          />
        )}
    </Box>
  );
}

export default DepreciationLayout;
