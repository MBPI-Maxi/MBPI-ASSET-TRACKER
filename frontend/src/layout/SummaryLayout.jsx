import { useReducer, useEffect, useRef, memo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ErrorFetching } from '@/pages/alerts';
// import {
//   Table,
//   TableContainer,
//   Paper,
//   TablePagination,
//   Box,
//   Typography,
// } from '@mui/material';

import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import {
  LocalizationProvider,
  DatePicker
} from '@mui/x-date-pickers';

import { RenderLoadingScreenTable } from '@pages/Skeleton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useReactToPrint } from 'react-to-print';
import { PrintButton, ExportToExcel, AssetScanSummary } from '@/components/summaryTable/customButtonHelpers';
import TableSummary from '@/components/summaryTable/TableSummary';

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
    default:
      return state;
  }
}

function SummaryLayout({
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
    queryFn: () => {
      if (!state.startDate || !state.endDate) {
        return Promise.resolve({ results: [], count: 0 }); // don't call API if startdate and enddate is not set
      }

      return apiFunc({
        startDate: state.startDate,
        endDate: state.endDate,
        rowsPerPage: state.rowsPerPage,
        page: state.page + 1,
        endpoint: endpoint,
        queryKeyString: queryKeyString
      });
    },
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

  const handlePrint = useReactToPrint({
    contentRef: componentRef
  });

  useEffect(() => {
    if (isError) {
      showSnackbar();
    }
  }, [isError])

  const rows = data?.results || [];
  
  return (
    <Box>
      <Typography variant='body1' sx={{ mb: "30px" }}>
        {title}
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
                <Box display="flex" gap={2} mb={2}>
                  <PrintButton handlePrint={handlePrint} />
                  <ExportToExcel data={rows} fileName={fileNameStr || "summary-report"} exportType="xls" />
                </Box>

                <Box ref={componentRef}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableSummary data={rows} nameSummaryReport={nameSummaryReport} />
                    </Table>
                  </TableContainer>
                </Box>

                {/* render here if nameSummaryReport is AssetScanverification report */}
                {
                  nameSummaryReport === "asset-scan-verification-report" &&
                  data?.missing_assets !== undefined &&
                  data?.total_missing_value !== undefined && (
                    <AssetScanSummary
                      nameSummaryReport={nameSummaryReport}
                      missingAssetCount={data.missing_assets}
                      totalMissingValue={data.total_missing_value}
                    />
                  )
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

      </LocalizationProvider>
      {
        openSnackbar &&
        <ErrorFetching
          openSnackbar={openSnackbar}
          hideSnackbar={hideSnackbar}
          msg={snackBarMessage || "Error Fetching"}
        />
      }
    </Box>
  );
}

export default SummaryLayout;
