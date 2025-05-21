import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { DrawerMenu } from '@/components/persistentDrawer/DrawerMenu';
import { DRAWER_WIDTH } from '@/constants/layout';
import { Outlet } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  IconButton, 
  Divider, 
  Drawer,
  Link as MuiLink
} from '@mui/material';
import { 
  Main, 
  AppBar, 
  DrawerHeader 
} from '@/components/persistentDrawer/styles';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';

export default function Core() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          
          <MuiLink
            component={RouterLink}
            to="/"
            color='textSecondary'
            sx={{
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Redirect to Home Page
          </MuiLink>
        </Toolbar>
      </AppBar>
      
      {/* arrow icon on the drawer */}
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <DrawerMenu />
      </Drawer>


      {/* main content here per click of page*/}
      <Main open={open}>
        <DrawerHeader />
        
        <Outlet />
      </Main>
    </Box>
  );
}
