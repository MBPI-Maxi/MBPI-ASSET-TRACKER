import {
  Box, Button, TextField, Checkbox, FormControlLabel,
  MenuItem, Typography,
  InputLabel
} from '@mui/material';
import { useState } from 'react';
import { AddAssetSnackBar } from '@pages/alerts';
import formValidation from '@pages/validate';
import { addAssetSchema } from '@pages/auth/validationSchema';
import { useFormContext } from '@/context/FormProvider';

export default function AddAsset() {

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
  } = useFormContext()

  // Dummy dropdown options
  const departments = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'Finance' },
  ];

  const locations = [
    { id: 1, name: 'IT ROOM' },
    { id: 2, name: 'STOCK ROOM' },
    { id: 3, name: 'MEETING ROOM' },
  ];

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

      console.log("Form submitted successful");
      showSnackbar();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Box>
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
            >
              {departments.map(dept => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
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
            >
              {locations.map(loc => (
                <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
              ))}
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
            />

            <TextField
              fullWidth
              name="remarks"
              label="Remarks"
              value={form.remarks}
              onChange={handleChange}
              margin="normal"
              helperText={errors.remarks || " "}
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
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      {/* Snack bar here */}
      {
        openSnackbar &&
        <AddAssetSnackBar openSnackbar={openSnackbar} hideSnackbar={hideSnackbar} />
      }
    </Box>
  );
}
