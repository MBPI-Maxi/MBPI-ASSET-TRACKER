import { useState } from 'react';
import {
  Box, 
  TextField, 
  MenuItem, 
  Checkbox, 
  FormControlLabel,
  Typography, 
  Button
} from '@mui/material';

const dummyAssets = [
  {
    id: 1,
    item_name: "CPU",
    department: "IT",
    brand: "Corsair",
    is_active: false,
    is_found: false,
    location: "IT ROOM",
    amount_purchased: "35000",
    remarks: "Testing",
    vendor: "Vendor A"
  },
  {
    id: 2,
    item_name: "Laptop",
    department: "HR",
    brand: "HP",
    is_active: true,
    is_found: true,
    location: "HR ROOM",
    amount_purchased: "50000",
    remarks: "Old laptop",
    vendor: "Vendor B"
  }
];

const UpdateAsset = () => {
  // Dummy initial data
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
  });
  const [selectedId, setSelectedId] = useState(null); 

  // example only

  const handleSelectChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedId(id);

    const selectedAsset = dummyAssets.find(asset => asset.id === id);
    
    if (selectedAsset) {
      setForm(selectedAsset);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data to submit:', form);
    // Add PUT request here when backend is connected
  };
  return (
    <Box maxWidth="1000px" mx="auto" p={3}>
      <Typography variant="h5" gutterBottom>
        Update Asset
      </Typography>

      <Box display="flex" gap={4} alignItems="flex-start">
        {/* Left Side: Dropdown */}
        <Box flex={1}>
          <TextField
            select
            fullWidth
            label="Select Asset"
            value={selectedId ?? ""}
            onChange={handleSelectChange}
            margin="normal"
          >
            {dummyAssets.map(asset => (
              <MenuItem key={asset.id} value={asset.id}>
                {asset.item_name} - {asset.department}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Right Side: Form */}
        {selectedId && (
          <Box component="form" onSubmit={handleSubmit} flex={2}>
            <TextField
              fullWidth
              name="item_name"
              label="Item Name"
              value={form.item_name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="department"
              label="Department"
              value={form.department}
              onChange={handleChange}
              margin="normal"
            />
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

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Update
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UpdateAsset;
