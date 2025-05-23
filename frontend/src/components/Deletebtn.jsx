import { Button } from "@mui/material";
import { useState } from "react";
import { DeleteDialogue } from "@/pages/alerts";

// change this to use the actual data next time
export default function Deletebtn({ selectedId, dummyAssets, setSelectedId, showSnackbar }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const confirmDelete = () => {
    if (selectedId === null) return;

    const updatedAssets = dummyAssets.filter(asset => asset.id !== selectedId);
    console.log("Updated Assets (after deletion):", updatedAssets);

    setSelectedId(null);
    setOpenConfirmDialog(false);

    showSnackbar();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 3, ml: 2 }}
        onClick={() => setOpenConfirmDialog(true)}
      >
        Delete
      </Button>
      <DeleteDialogue 
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={confirmDelete}
      />
    </>    
  )
}