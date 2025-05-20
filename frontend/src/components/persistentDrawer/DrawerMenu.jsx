// src/components/PersistentDrawer/DrawerMenu.js
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useNavigate } from 'react-router-dom';

const menuSections = [
  {
    title: 'Asset',
    items: [
      { label: 'Add', icon: <AddBoxIcon />, path: 'asset/add' },
      { label: 'Update', icon: <EditIcon />, path: 'asset/update' },
      { label: 'Delete', icon: <DeleteIcon />, path: 'asset/delete' },
    ],
  },
  {
    title: 'QRCode',
    items: [
      { label: 'View QR Code', icon: <QrCodeIcon />, path: 'qrcode/view' },
    ],
  },
  {
    title: 'Summary',
    items: [
      { label: 'Asset Summary', icon: <SummarizeIcon />, path: 'summary/assets' },
      { label: 'Department Summary', icon: <SummarizeIcon />, path: 'summary/departments' },
      { label: 'Location Summary', icon: <SummarizeIcon />, path: 'summary/locations' },
    ],
  },
];

export function DrawerMenu() {
  const navigate = useNavigate();

  const handlePathNavigation = (path) => {
    console.log(path);
    navigate(path);
  }

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
                      onClick={() => handlePathNavigation(path)}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                ))}
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