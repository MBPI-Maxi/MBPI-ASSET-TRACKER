import React from 'react';
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import MoodIcon from '@mui/icons-material/Mood';

const ProfilePage = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      bgcolor="#f9f9f9"
      px={3}
    >
      <MoodIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Profile Page? Not Yet. 😅
      </Typography>
      <Typography variant="body1" mb={3}>
        This page will be ready next time — pinky promise! 😉
      </Typography>
      <Button variant="contained" color="primary" onClick={() => alert("Stay tuned!")}>
        Okay LOL
      </Button>
    </Box>
  );
};

export default ProfilePage;
