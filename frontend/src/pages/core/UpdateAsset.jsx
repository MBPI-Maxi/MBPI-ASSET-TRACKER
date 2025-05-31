import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateAssetSchema } from "@pages/auth/validationSchema";
import { useFormContext } from '@/context/FormProvider';
import { UpdateAssetSnackBar, DeleteSnackbar, UpdateAssetInstruction } from '@pages/alerts';

import formValidation from '@pages/validate';
import Deletebtn from '@/components/Deletebtn';
import API_ROUTES from '@/api/api';
import { DEPARTMENT_LIST } from '@/constants/backendData';

const UpdateAsset = () => {
  const [form, setForm] = useState({
    item_name: '',
    department: '',
    brand: '',
    is_active: false,
    is_found: false,
    location: '',
    amount_purchased: '',
    remarks: '',
    vendor: '',
    rs_number: ''
  });
  const [selectedId, setSelectedId] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);
  const queryClient = useQueryClient();

  // function for showing snackbar for deletion
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const showDeleteSnackbar = () => setDeleteSnackbarOpen(true);
  const hideDeleteSnackbar = () => setDeleteSnackbarOpen(false);

  const {
    errors,
    setErrors,
    showSnackbar,
    hideSnackbar,
    openSnackbar
  } = useFormContext();

  const updateMutation = useMutation({
    mutationFn: ({ selectedId, data }) => API_ROUTES.putAsset(selectedId, data),
    onSuccess: (data) => {
      console.log(data);
      showSnackbar();
      setHasClicked(true);
    },
    onError: (error) => {
      console.error("Error updating the asset: ", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allAssetsForUpdate"] });
    }
  })

  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["allAssetsForUpdate"],
    queryFn: async () => {
      let allAssets = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const data = await API_ROUTES.getAllAssets({ page, pageSize: 10 });
        allAssets = allAssets.concat(data.results);
        hasNext = data.next !== null;
        page++;
      }

      return allAssets;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })

  const assets = data || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (hasClicked) {
      setHasClicked(false);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedId === null) {
      setErrors({ form: "Please select an asset to update." });
      return;
    }

    // handle validation here
    const validationErrors = await formValidation(form, updateAssetSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      
      // API HERE TO PUT REQUEST
      updateMutation.mutate({ selectedId, data: { ...form } });

      showSnackbar();
      
    } else {
      setErrors(validationErrors);
    }
  };

  // The useEffect is now simplified to only reset the form when selectedId becomes null.
  useEffect(() => {
    if (selectedId === null) {
      setForm({
        item_name: '',
        department: '',
        brand: '',
        is_active: false,
        is_found: false,
        location: '',
        amount_purchased: '',
        remarks: '',
        vendor: '',
        rs_number: ''
      });

      setErrors({}); // Clear validation errors when no asset is selected
    }
  }, [selectedId, setErrors]); // Include setErrors in dependency array as good practice, though it's likely stable

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading assets...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">Failed to load assets: {error?.message || 'Unknown error'}</Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" mx="auto" p={3}>
      <UpdateAssetInstruction />

      <Typography variant="h5" gutterBottom>
        Update Asset
      </Typography>
      
      <Box display="flex" gap={4} alignItems="flex-start">
        {/* Left Side: Autocomplete Dropdown */}
        <Box flex={2}>
          <Autocomplete
            fullWidth
            options={assets}
            getOptionLabel={(option) =>
              `${option.item_name} - ${option.department} (Asset ID: ${option.asset_id})`
            }
            value={assets.find(asset => asset.asset_id === selectedId) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                // When a new asset is selected, set both the ID and the form data
                setSelectedId(newValue.asset_id);
                
                setForm({
                  item_name: newValue.item_name || '',
                  department: newValue.department || '',
                  brand: newValue.brand || '',
                  is_active: newValue.is_active || false,
                  is_found: newValue.is_found || false,
                  location: newValue.location || '',
                  amount_purchased: newValue.amount_purchased ? String(parseFloat(newValue.amount_purchased).toFixed(2)) : '',
                  remarks: newValue.remarks || '',
                  vendor: newValue.vendor || '',
                  rs_number: newValue.rs_number || '',
                });
                
                setErrors({}); // Clear any previous validation errors for the new selection
              } else {
                // When Autocomplete is cleared, set selectedId to null.
                // The useEffect will then handle resetting the form fields.
                setSelectedId(null);
              }
            }}
            isOptionEqualToValue={(option, value) => option.asset_id === value.asset_id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Asset"
                margin="normal"
              />
            )}
            disabled={assets.length === 0 && !isLoading}
          />
        </Box>

        {/* Right Side: Form */}
        {
          selectedId && (
            <Box component="form" onSubmit={handleSubmit} flex={2}>
              <TextField
                fullWidth
                name="item_name"
                label="Item Name"
                value={form.item_name}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors.item_name)}
                helperText={errors.item_name}
                required
              />
              <Box>
                <TextField
                  select
                  fullWidth
                  name="department"
                  label="Department"
                  value={form.department}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={Boolean(errors.department)}
                  helperText={errors.department || " "}
                >
                  {
                    DEPARTMENT_LIST.map((dept, index) => {
                      let key = `update-${dept}-${index}`;
                      return <MenuItem key={key} value={dept}>
                        {dept}
                      </MenuItem>
                    })
                  }
                </TextField>
              </Box>
              <TextField
                fullWidth
                name="brand"
                label="Brand"
                value={form.brand}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                name="location"
                label="Location"
                value={form.location}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                name="amount_purchased"
                label="Amount Purchased"
                value={form.amount_purchased}
                onChange={handleChange}
                type="number"
                margin="normal"
              />
              <TextField
                fullWidth
                name="purchased_date"
                label="Purchased Date"
                type="date"
                value={form.purchased_date}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors.purchased_date)}
                helperText={errors.purchased_date || " "}
                slotProps={{
                  inputLabel: { shrink: true }
                }}
              />

              <TextField
                fullWidth
                name="vendor"
                label="Vendor"
                value={form.vendor}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                name="remarks"
                label="Remarks"
                value={form.remarks}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                name="rs_number"
                label="RS Number"
                value={form.rs_number}
                onChange={handleChange}
                margin="normal"
              />

              <Box display="flex" flexDirection="column" mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                    />
                  }
                  label="Active Item?"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_found"
                      checked={form.is_found}
                      onChange={handleChange}
                    />
                  }
                  label="Item is present?"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => setHasClicked(true)}
              >
                Update
              </Button>

              <Deletebtn
                selectedId={selectedId}
                apiFunc={API_ROUTES.deleteAsset}
                showSnackbar={showDeleteSnackbar}
                onDeleteSuccess={() => {
                  setSelectedId(null); // This will trigger the useEffect to reset the form
                }}
              />
            </Box>
          )
        }
      </Box>
      {/* SNACKBAR FOR UPDATE AND DELETE HERE */}
      {
        openSnackbar && hasClicked &&
        <UpdateAssetSnackBar openSnackbar={openSnackbar} hideSnackbar={hideSnackbar} />
      }
      {
        deleteSnackbarOpen &&
        <DeleteSnackbar openSnackbar={deleteSnackbarOpen} hideSnackbar={hideDeleteSnackbar} />
      }
    </Box>
  );
};

export default UpdateAsset;