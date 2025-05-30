import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

const EmptyAssetMessage = () => (
  <Box sx={{
    display: "flex",
    justifyContent: "center"
  }}>
    <Typography
      variant="h6"
      align="center"
      color="text.secondary"
      sx={{ mt: 4 }}
    >
      😕 Oops! No assets matched your filters. Try adjusting your search.
    </Typography>
  </Box>
);

export default EmptyAssetMessage;
