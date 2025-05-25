import { useEffect, useMemo } from 'react';
// import {
//   Button,
//   Grid,
//   TablePagination,
//   Box,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { 
  DEPARTMENT_LIST, 
  STATUS_IS_ACTIVE_LIST, 
  LOCATION_LIST } 
from '@/constants/backendData';

import { ErrorFetching } from '@pages/alerts';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useQRCodeContext } from '@/context/QRCodeContext';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '@/helpers/helper';
import { QRCodeSkeleton } from '@pages/Skeleton';

import EmptyAssetMessage from '@/components/qrcode/EmptyAssetMessage';
import AssetQRCodeCard from '@/components/qrcode/AssetQRCodeCard';
import API_ROUTES from '@/api/api.jsx';

export default function QRCode() {
  const {
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
  } = useQRCodeContext();

  const {
    openSnackbar,
    hideSnackbar,
    showSnackbar
  } = useSnackBarContext();

  const memoizedFilters = useMemo(() => {
    return searchFilters;
  }, [searchFilters])

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assets", page, rowsPerPage, memoizedFilters],
    queryFn: () =>
      API_ROUTES.getAllAssets({
        page: page + 1,
        pageSize: rowsPerPage,
        ...memoizedFilters,
      }),
    placeholderData: keepPreviousData,
    retry: 2,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  const handleSearchClick = () => {
    setSearchFilters({
      item_name: inputValue,
      department,
      is_active,
      location,
      purchased_date,
    });

    setPage(0);
  };

  const assets = data?.results || [];
  const count = data?.count || 0;

  useEffect(() => {
    if (isError) {
      showSnackbar();
    }
  }, [isError])

  return (
    <Box>
      {/* Search Filters */}
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        mb={3}
      >
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            label="Department"
          >
            <MenuItem value="all">ALL</MenuItem>
            {
              DEPARTMENT_LIST.map((department, index) => {
                let key = `qrcode-${department}-${index}`;

                return <MenuItem key={key} value={`${department}`}>
                  { department }
                </MenuItem>
              })
            }
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={is_active}
            onChange={(e) => setIsActive(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            {
              STATUS_IS_ACTIVE_LIST.map((status, index) => {
                let key = `qrcode-${status}-${index}`;
                let capitalize = capitalizeFirstLetter(status);

                return <MenuItem key={key} value={`${status}`}>
                  { capitalize }
                </MenuItem>
              })
            }
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            label="Location"
          >
            <MenuItem value="location">Location</MenuItem>
            {
              LOCATION_LIST.map((location, index) => {
                let key = `qrcode-${location}-${index}`

                return <MenuItem key={key} value={`${location}`}>
                  { location }
                </MenuItem>
              })
            }
          </Select>
        </FormControl>

        <TextField
          label="Purchased Date"
          type="date"
          fullWidth
          value={purchased_date}
          onChange={(e) => setPurchasedDate(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            size="large"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Box>
      </Box>

      <Grid container spacing={10}>
        {
          isLoading
            ? <QRCodeSkeleton count={rowsPerPage} />
            : (assets.length === 0 && !isError)
              ? <EmptyAssetMessage />
              : <AssetQRCodeCard assets={assets} />
        }
      </Grid>

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />

      {/* Snackbar */}
      {
        openSnackbar &&
        <ErrorFetching 
          openSnackbar={openSnackbar} 
          hideSnackbar={hideSnackbar}
          msg="Error fetching the QR code in the database"
        />
      }
    </Box>
  );
}
