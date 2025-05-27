import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useState } from 'react';
import { AddAssetSnackBar, AddAssetInstruction } from '@pages/alerts';
import { addAssetSchema } from '@pages/auth/validationSchema';
import { useFormContext } from '@/context/FormProvider';
import { DEPARTMENT_LIST, LOCATION_LIST } from '@/constants/backendData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API_ROUTES from '@/api/api';
import formValidation from '@pages/validate';

export default function AddAsset() {
  const queryClient = useQueryClient();
  const [formDisabled, setFormDisabled] = useState(false);
  const [form, setForm] = useState({
    item_name: '',
    department: '',
    amount_purchased: '',
    purchased_date: '',
    warranty_expiry: '',
    location: '',
    is_active: true,
    is_found: true,
    remarks: '',
    vendor: ''
  });

  const {
    openSnackbar,
    showSnackbar,
    hideSnackbar,
    errors,
    setErrors
  } = useFormContext();

  const resetForm = () => {
    setForm({
      item_name: '',
      department: '',
      amount_purchased: '',
      purchased_date: '',
      warranty_expiry: '',
      location: '',
      is_active: true,
      is_found: true,
      remarks: '',
      vendor: ''
    });

    setFormDisabled(false);
  };

  const mutation = useMutation({
    mutationFn: (data) => API_ROUTES.postAsset(data)
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formValidation(form, addAssetSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setFormDisabled(true);

      mutation.mutate(form, {
        onSuccess: () => {
          showSnackbar();
          console.log("Success submitting the form");
        },
        onError: (error) => {
          showSnackbar();
          console.error("Error in the asset addition", error);
        },
        onSettled: () => {
          queryClient.invalidateQueries(["allAssetsForUpdate"]);
        }
      });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Box>
      <AddAssetInstruction />
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Typography variant="h5" gutterBottom>Add Asset</Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          {/* Left Column */}
          <Box flex={1}>
            <TextField
              fullWidth
              label="Item"
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              error={Boolean(errors.item_name)}
              helperText={errors.item_name || " "}
              disabled={formDisabled}
            />

            <TextField
              select
              fullWidth
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              margin="normal"
              required
              error={Boolean(errors.department)}
              helperText={errors.department || " "}
              disabled={formDisabled}
            >
              {
                DEPARTMENT_LIST.map((dept, index) => {
                  let key = `asset-${dept}-${index}`;

                  return <MenuItem key={key} value={dept}>
                    {dept}
                  </MenuItem>
                })
              }
            </TextField>

            <TextField
              select
              fullWidth
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              margin="normal"
              required
              error={Boolean(errors.location)}
              helperText={errors.location || " "}
              disabled={formDisabled}
            >
              {
                LOCATION_LIST.map((location, index) => {
                  let key = `asset-${location}-${index}`;

                  return <MenuItem key={key} value={location}>
                    {location}
                  </MenuItem>
                })
              }
            </TextField>

            <TextField
              fullWidth
              name="amount_purchased"
              label="Amount Purchased"
              value={form.amount_purchased}
              onChange={handleChange}
              type="number"
              margin="normal"
              helperText={errors.amount_purchased || " "}
              disabled={formDisabled}
            />
          </Box>

          {/* Right Column */}
          <Box flex={1}>
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
              disabled={formDisabled}
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              fullWidth
              name="warranty_expiry"
              label="Warranty Expiry"
              type="date"
              value={form.warranty_expiry}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.warranty_expiry)}
              helperText={errors.warranty_expiry || " "}
              disabled={formDisabled}
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
              helperText={errors.vendor || " "}
              disabled={formDisabled}
            />

            <TextField
              fullWidth
              name="remarks"
              label="Remarks"
              value={form.remarks}
              onChange={handleChange}
              margin="normal"
              helperText={errors.remarks || " "}
              disabled={formDisabled}
            />
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" mt={1}>
          <FormControlLabel
            control={
              <Checkbox
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                disabled={formDisabled}
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
                disabled={formDisabled}
              />
            }
            label="Item is present?"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      {/* Snack bar here */}
      {
        openSnackbar && mutation.isSuccess
          ? <AddAssetSnackBar
            openSnackbar={openSnackbar}
            hideSnackbar={hideSnackbar}
            msg="Form submitted successfully."
            onCloseCallback={resetForm}
          />
          : <AddAssetSnackBar
            openSnackbar={openSnackbar}
            hideSnackbar={hideSnackbar}
            msg="Error submitting the form"
            onCloseCallback={resetForm}
          />
      }
    </Box>
  );
}
