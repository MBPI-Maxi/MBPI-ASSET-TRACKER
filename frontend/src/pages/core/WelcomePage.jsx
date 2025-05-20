import { Box, Typography, Paper } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';

export default function WelcomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600 }}>
        <InventoryIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Welcome to the Asset Management System
        </Typography>
        <Typography variant="body1" align="center">
            Use the menu on the left to 
            <strong> add/update assets, </strong>  
            <strong> view QR Codes </strong>  
            and 
            <strong> generate summaries. </strong>
        </Typography>
      </Paper>
    </Box>
  );
}
