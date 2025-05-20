import { Snackbar, Alert, Button } from "@mui/material"

export function RegistrationSnackBar({ openSnackbar, hideSnackbar }) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={2000}
      onClose={hideSnackbar}
      // message="Successfully registered!"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="success">
        Successfully Registered!
      </Alert>
    </Snackbar>
  );
}

export function AddAssetSnackBar({ openSnackbar, hideSnackbar }) {
  return (
    <Snackbar
      open={openSnackbar}
      onClose={hideSnackbar}
      autoHideDuration={6000}
      message="Form submitted successfully."
      action={
        <Button 
          color="secondary" 
          size="small" 
          onClick={hideSnackbar}
        >
          CLOSE
        </Button>
      }
    />
  );
}

// export function UpdateAssetSnackbar()