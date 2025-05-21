import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getDepartments from "@/api/api";

export default function AssetFormCard() {
  const [formData, setFormData] = useState({
    itemName: "",
    purchaseValue: "",
    active: true,
    department: "",
  });

  const { isLoading, data, error } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments
  })

  const handleChange = (field) => (event) => {
    const value =
      field === "active" ? event.target.checked : event.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <CardHeader title="Asset Information" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Item Name"
            value={formData.itemName}
            onChange={handleChange("itemName")}
            required
            fullWidth
          />

          <TextField
            label="Purchase Value"
            type="number"
            value={formData.purchaseValue}
            onChange={handleChange("purchaseValue")}
            required
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.active}
                onChange={handleChange("active")}
              />
            }
            label="Active"
          />

          <FormControl fullWidth required>
            <InputLabel>Department</InputLabel>
            <Select
              value={formData.department}
              label="Department"
              onChange={handleChange("department")}
            >
              {/* <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem> */}

              {
                isLoading 
                  ? <MenuItem>Loading Departments...</MenuItem> 
                  : (
                    data ? data.map((item, index) => {
                      return <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    }) 
                    : <MenuItem disabled>Failed to load resources...</MenuItem>
                  )
              }

            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Save Asset
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
