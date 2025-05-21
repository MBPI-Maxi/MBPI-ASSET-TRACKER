import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  TablePagination,
  Box,
  TextField,
  FormControl, 
  InputLabel,
  Select, 
  MenuItem
} from '@mui/material';
import { QRCodeErrorFetching } from '@pages/alerts';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useQRCodeContext } from '@/context/QRCodeContext';
import { useQuery } from '@tanstack/react-query';
import { QRCodeAssetNotFound } from '@pages/alerts';
import QRCodeSkeleton from '@pages/Skeleton';
import API_ROUTES from '@/api/api.jsx';

export default function QRCode() {
  // const [page, setPage] = useState(0); // zero-indexed
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [inputValue, setInputValue] = useState("");
  // const [searchFilters, setSearchFilters] = useState({
  //   item_name: "",
  //   department: "",
  //   is_active: "",
  //   location: "",
  //   purchased_date: "",
  // });

  

  // const [department, setDepartment] = useState('');
  // const [is_active, setIsActive] = useState('');
  // const [location, setLocation] = useState('');
  // const [purchased_date, setPurchasedDate] = useState('');
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assets', page, rowsPerPage, searchFilters],
    queryFn: () =>
      API_ROUTES.getAllAssets({
        page: page + 1,
        pageSize: rowsPerPage,
        ...searchFilters,
      }),
    keepPreviousData: true,
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
      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchClick();
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            label="Department"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            {/* Add more departments as needed */}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={is_active}
            onChange={(e) => setIsActive(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="retired">Retired</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <TextField
          label="Purchased Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={purchased_date}
          onChange={(e) => setPurchasedDate(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleSearchClick}
          sx={{ alignSelf: 'flex-end' }}
        >
          Search
        </Button>
      </Box>

      <Grid container spacing={10}>
        {isLoading
          ? <QRCodeSkeleton count={rowsPerPage} />
          : (assets.length === 0)
              ? <QRCodeAssetNotFound />
              : assets.map((asset) => (
                  <Grid key={asset.asset_id}>
                    <Card sx={{ maxWidth: 345, p: 3, borderRadius: "20px" }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={asset.qr_code_image}
                        alt={`QR for ${asset.item_name}`}
                        sx={{ height: 200, objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                      />
                      <CardContent>
                        <Typography variant="h6">
                          {asset.item_name}
                        </Typography>
                        <RenderAssetDetails {...asset} />
                      </CardContent>
                      <CardActions>
                        <Button size="small">View</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
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
        openSnackbar && (
          <QRCodeErrorFetching openSnackbar={openSnackbar} hideSnackbar={hideSnackbar} />
        )}
    </Box>
  );
}

function RenderAssetDetails({ asset_id, purchased_date, amount_purchased, department, location }) {
  return (
    <>
      <Typography variant="body2" color="text.secondary" align='left'>
        Asset_ID: {asset_id}
      </Typography>
      <Typography variant="body2" color="text.secondary" align='left'>
        Purchased Date: {purchased_date}
      </Typography>
      <Typography variant="body2" color="text.secondary" align='left'>
        Amount Purchased: {amount_purchased}
      </Typography>
      <Typography variant="body2" color="text.secondary" align='left'>
        Department: {department}
      </Typography>
      <Typography variant="body2" color="text.secondary" align='left'>
        Location: {location}
      </Typography>
    </>
  );
}
