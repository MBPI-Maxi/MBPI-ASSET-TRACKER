import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';

import { useNavigate } from 'react-router-dom';

const errorTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#d32f2f', // Red for error emphasis
      },
      background: {
        default: 'white',
      },
    },
    typography: {
      h1: {
        fontWeight: 'bold',
        fontSize: '3rem',
      },
      body1: {
        fontSize: '1.2rem',
      },
    },
});

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={errorTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/app")}
          sx={{ mt: 2 }}
        >
          Go To App
        </Button>
      </Box>
    </ThemeProvider>
  );
}
