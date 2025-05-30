import Button from "@mui/material/Button";
import { useState } from "react";
import { DeleteDialogue } from "@/pages/alerts";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import CircularProgress from '@mui/material/CircularProgress';

// change this to use the actual data next time
export default function Deletebtn({ selectedId, showSnackbar, apiFunc, onDeleteSuccess }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (assetId) => apiFunc(assetId)
  })

  const confirmDelete = () => {
    if (selectedId === null) {
      setOpenConfirmDialog(false);
      return;
    }

    // call the api here to delete
    mutation.mutate(selectedId, {
      onSuccess: (response) => {
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }

        console.log(response);
      },
      onError: (error) => {
        console.error(`An error occured: ${error}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["allAssetsForUpdate"]); // to do refetch
        setOpenConfirmDialog(false);
        showSnackbar();
      }
    })    
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 3, ml: 2 }}
        onClick={() => setOpenConfirmDialog(true)}
        disabled={selectedId === null || mutation.isPending}
      >
        {
          mutation.isPending
            ? <CircularProgress size={24} color="inherit" />
            : "Delete"
        }
      </Button>
      <DeleteDialogue 
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={confirmDelete}
        isDeleting={mutation.isPending}
      />
    </>    
  )
}