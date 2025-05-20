// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { Button, Box, Typography, Container, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Registration from './auth/Registration';

const LandingPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpenRegister = () => setOpen(true);
  const handleCloseRegister = () => setOpen(false);
 
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h3" gutterBottom>
          Welcome to MBPI!
        </Typography>
        <Typography variant="subtitle1" mb={2} gutterBottom>
          Please sign in or sign up to access the asset management system.
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Built exclusively for MBPI employees — your one-stop solution for tracking and managing company assets.
        </Typography>

        <Box 
          display="flex" 
          gap={2}
          sx={{
            marginTop: "30px"
          }}
        >
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="outlined" color="primary" onClick={handleOpenRegister}>
            Register
          </Button>
        </Box>
      </Box>

      <DisplayDialogueRegistration 
        open={open} 
        handleCloseRegister={handleCloseRegister} 
      />
    
    </Container>
  );
};

function DisplayDialogueRegistration({ open, handleCloseRegister }) {
  return (
    <Dialog 
      open={open} 
      onClose={handleCloseRegister} 
      fullWidth 
      maxWidth="sm"
      slot={{
        paper: {
        sx: {
          borderRadius: 4,
          boxShadow: 6,
          bgcolor: 'background.paper',
          px: 3,
          py: 2,
        },
      },
      }}
    >
        {/* <DialogTitle>Register</DialogTitle> */}
        <DialogContent>
          <Registration />
        </DialogContent>
    </Dialog>
  )
}

export default LandingPage;
