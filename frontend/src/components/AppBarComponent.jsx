import { AppBar, Toolbar, Typography, Button, colors } from "@mui/material";

const classes = {
  typography: {
    textDecoration: "underline",
    textTransform: "none",
  }
}

export default function AppBarComponent() {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button color="inherit">
          <Typography component="span" sx={classes.typography}>
            Add New Asset
          </Typography>
        </Button>
        <Button color="inherit">
          <Typography component="span" sx={classes.typography}>
            Get QRCode
          </Typography>
        </Button>
        <Button color="inherit">
          <Typography component="span" sx={classes.typography}>
            Summary
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}