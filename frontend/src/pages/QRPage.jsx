import { useState } from "react";
import { Box, Typography } from "@mui/material";
// import QRCode from "react-qr-code"; // or any QR code library
import TableQR from "@/components/Table";

export default function QRPage() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Table Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Asset Table
        </Typography>
        <TableQR onRowClick={handleRowClick}/>
      </Box>

      {/* QR Code Section */}
      {selectedItem && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <img
            src={`/api/qr-code/${selectedItem.id}`} // Adjust the endpoint as needed
            alt={`QR code for ${selectedItem.name}`}
            style={{ width: 150, height: 150 }}
          />
        </Box>
      )}
    </Box>
  );
}
