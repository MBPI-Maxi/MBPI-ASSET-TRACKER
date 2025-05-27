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

import { useEffect } from 'react';

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

export function AddAssetSnackBar({ openSnackbar, hideSnackbar, msg, onCloseCallback, resetMutation }) {
  const handleClose = () => {
    hideSnackbar();
    onCloseCallback();
    resetMutation();
  }

  return (
    <Snackbar
      open={openSnackbar}
      onClose={hideSnackbar}
      // autoHideDuration={6000}
      message={msg}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
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
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={hideSnackbar} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  )
}

export function AddAssetInstruction() {
  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        How to Use This Form:
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
        <li>Fill in the asset details including item name, department, location, amount, vendor, and dates.</li>
        {/* <li>Use the checkboxes to mark whether the asset is active and physically present.</li> */}
        <li>Use the checkboxes to mark if the asset is active (i.e., currently being used) and if the item is present (i.e., not missing).</li>
        <li>Click <strong>Submit</strong> to save the asset. A success or error message will appear.</li>
        <li>If the warranty date is not applicable, please enter the same date as the purchase date.</li>
        <li>All required fields must be completed before submission.</li>
      </ul>
    </Alert>
  );
}

export function UpdateAssetInstruction() {
  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        How to Update an Asset:
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
        <li>Select an asset from the dropdown list to load its details.</li>
        <li>Modify any asset details such as name, department, location, amount, vendor, and dates.</li>
        <li>Use the checkboxes to mark if the asset is active and physically present.</li>
        <li>Click <strong>Update</strong> to save your changes. You will see a success or error message.</li>
        <li>If you want to remove the asset, use the delete button below the form.</li>
      </ul>
    </Alert>
  );
}

export function QRCodeInstruction() {
  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        How to Use the QR Code Search:
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
        <li>Use the filters to search assets by name, department, status, location, and purchase date.</li>
        <li>
          Click
          <strong> Search </strong>
          or press
          <em> Enter </em>
          in the Item Name field to apply filters.
        </li>
        <li>
          Click
          <strong> Clear All </strong>
          to reset all filters and show all assets.
        </li>
        <li>
          The results will show asset QR codes below with pagination controls.
        </li>
        <li>
          If there is an error fetching data, an error message will appear.
        </li>
      </ul>
    </Alert>
  );
}

export function SummaryInstruction() {
  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        How to Use the Summary Report:
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
        <li>Select a <strong>Start Date</strong> and an <strong>End Date</strong> to filter the data.</li>
        <li>The table will automatically fetch and display the results after selecting both dates.</li>
        <li>Use the <strong>Print</strong> button to generate a printable version of the report.</li>
        <li>You can also <strong>export</strong> the data as an Excel file using the Export button.</li>
        <li>If there's an error fetching data, an error message will be displayed.</li>
      </ul>
    </Alert>
  );
}

export function MaintenanceReportInstruction() {
  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        How to Fill Out the Maintenance Report:
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
        <li>Enter the <strong>Service Type</strong> (e.g., Repair, Inspection).</li>
        <li>Select the relevant <strong>Asset</strong> from the dropdown or search for it by ID. Please try to enter ID number on the Box</li>
        <li>Provide the <strong>Service Date</strong> in the required format.</li>
        <li>Enter the <strong>Cost</strong> associated with the maintenance service.</li>
        <li>Use the <strong>Status</strong> toggle to indicate if the service is completed.</li>
        <li>Click <strong>Submit Report</strong> to save the entry. A success or error message will appear based on the outcome.</li>
      </ul>
    </Alert>
  );
}

export function DepreciationInstruction() {
  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        How to Use the Depreciation Report:
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
        <li>Select a <strong>Depreciation Method</strong> (e.g., Straight Line, Declining Balance).</li>
        <li>Enter the <strong>Useful Life</strong> of the asset in years.</li>
        <li>Click <strong>Compute</strong> to generate the depreciation summary based on your selections.</li>
        <li>Use <strong>Print</strong> or <strong>Export</strong> to download the summary.</li>
        <li>The <strong>Total Depreciation Value</strong> is displayed below the table if available.</li>
      </ul>
    </Alert>
  );
}

