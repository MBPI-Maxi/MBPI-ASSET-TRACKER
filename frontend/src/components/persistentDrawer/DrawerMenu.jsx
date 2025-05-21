// src/components/PersistentDrawer/DrawerMenu.js
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import menuSections from './menuSections';
import { useNavigate } from 'react-router-dom';

export function DrawerMenu() {
  const navigate = useNavigate();

  return (
    <>
      {
        menuSections.map((section, index) => (
          <Box key={section.title}>
            <List subheader={
              <ListItemText primary={section.title} sx={{ pl: 2, py: 1, color: 'text.secondary' }} />
            }>
              {
                section.items.map(({ label, icon, path }) => (
                  <ListItem key={label} disablePadding>
                    <ListItemButton
                      // Add onClick or routing logic here
                      onClick={() => navigate(path)}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                ))
              }
            </List>
            {
              index < menuSections.length - 1 
              && <Divider />
            }
          </Box>
        ))}
    </>
  );
}