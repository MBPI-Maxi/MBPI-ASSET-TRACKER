import { Drawer, Typography, Box } from "@mui/material";
import { CssBaseline } from "@mui/material";
import AppBarComponent from "./AppBarComponent";

const drawerWidth = 240;
const appBarHeight = 64;

export default function Nav({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box>
        <AppBarComponent />
      </Box>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Testing
        </Typography>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: "#f9f9f9",
          minHeight: "100vh",
          mt: `${appBarHeight}px`,
        }}
      >
        { children }
      </Box>
    </Box>
  )
}