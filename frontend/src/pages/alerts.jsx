import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export function RegistrationSnackBar({ openSnackbar, hideSnackbar }) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={hideSnackbar}
      // message="Successfully registered!"
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="success" onClose={hideSnackbar}>
        Successfully Registered!
        Please Login. 😃
      </Alert>
    </Snackbar>
  );
}

export function LoginSnackBar({ openSnackbar, hideSnackbar }) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={2000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success">
        Login Successfully!
      </Alert>
    </Snackbar>
  )
}

export function AddAssetSnackBar({ openSnackbar, hideSnackbar, msg, onCloseCallback }) {
  const handleClose = () => {
    hideSnackbar();
    onCloseCallback();
  }

  return (
    <Snackbar
      open={openSnackbar}
      onClose={hideSnackbar}
      // autoHideDuration={6000}
      message={msg}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      action={
        <Button
          color="secondary"
          size="small"
          onClick={handleClose}
        >
          CLOSE
        </Button>
      }
    />
  );
}

export function UpdateAssetSnackBar({ openSnackbar, hideSnackbar }) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={2000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success">
        Updated Successfully
      </Alert>
    </Snackbar>
  );
}

export function DeleteSnackbar({ openSnackbar, hideSnackbar }) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={2000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success">
        Deleted Successfully
      </Alert>
    </Snackbar>
  )
}

export function DeleteDialogue({ open, onClose, onConfirm, isDeleting }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 2 }
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <DeleteForeverIcon color="error" fontSize="large" />
          <Typography variant="h6" component="div">
            Confirm Deletion
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Are you sure you want to delete this asset? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{ minWidth: 100 }}
          autoFocus
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={24} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ErrorFetching({ openSnackbar, hideSnackbar, msg }) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="error">
        {msg}
      </Alert>
    </Snackbar>
  )
}

export function MaintenanceReportSnackbar({ openSnackbar, hideSnackbar, msg, severity }) {

  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} onClose={hideSnackbar} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  )
}
