import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";

import { useReactToPrint } from "react-to-print";
import { styled } from '@mui/material/styles';
import { useState, useRef, forwardRef } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function AssetQRCodeCard({ assets }) {
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleOpen = (asset) => {
    setSelectedAsset(asset);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      {
        assets.map((asset) => (
          <Grid key={asset.asset_id}>
            <Card sx={{ maxWidth: 345, p: 3, borderRadius: "20px" }}>
              <CardMedia
                component="img"
                height="140"
                image={asset.qr_code_image}
                alt={`QR for ${asset.item_name}`}
                sx={{
                  height: 200,
                  objectFit:
                    'contain',
                  backgroundColor:
                    '#f5f5f5'
                }}
              />
              <CardContent>
                <Typography variant="h6">
                  {asset.item_name}
                </Typography>
                <RenderAssetDetails {...asset} />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleOpen(asset)}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      }

      {/* dialog box here */}
      <DialogItemInfo
        open={open}
        handleClose={handleClose}
        data={selectedAsset}
      />
    </>
  );
}

function DialogItemInfo({ handleClose, open, data }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data?.item_name || 'QR'}-label`,
    pageStyle: `
      @page {
        size: 58mm auto;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
        }
        .print-area {
          width: 58mm;
          padding: 5mm;
          text-align: center;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      }
    `
  });

  if (!data) return null;

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        QR Code
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box>
          {
            data &&
            <RenderAssetInModal ref={printRef} data={data} />
          }
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handlePrint}
          variant="outlined"
          disabled={!data}
        >
          Print
        </Button>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

const RenderAssetInModal = forwardRef(({ data }, ref) => {
  const {
    asset_id,
    amount_purchased,
    purchased_date,
    department,
    item_name,
    brand,
    location,
    vendor,
    generated_by,
    updated_by,
    created_at,
    updated_at
  } = data;

  return (
    <Box ref={ref} display="flex" flexDirection="column" gap={1} className="print-area">
      <Typography variant="h6">{item_name}</Typography>
      <Typography variant="body2">Asset ID: {asset_id}</Typography>
      <Typography variant="body2">Brand: {brand}</Typography>
      <Typography variant="body2">Amount Purchased: {amount_purchased}</Typography>
      <Typography variant="body2">Purchased Date: {purchased_date}</Typography>
      <Typography variant="body2">Department: {department}</Typography>
      <Typography variant="body2">Location: {location}</Typography>
      <Typography variant="body2">Vendor: {vendor}</Typography>
      <Typography variant="body2">Created By: {`${generated_by?.first_name} ${generated_by?.last_name}` || 'Unknown'}</Typography>
      <Typography variant="body2">Updated By: {`${updated_by?.first_name} ${updated_by?.last_name}` || 'Unknown'}</Typography>
      <Typography variant="caption">Created At: {created_at}</Typography>
      <Typography variant="caption">Updated At: {updated_at}</Typography>
    </Box>
  );
});

function RenderAssetDetails({
  asset_id,
  purchased_date,
  amount_purchased,
  department,
  location
}) {
  return (
    <>
      <Typography variant="body2" color="text.secondary" align="left">
        Asset_ID: {asset_id}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="left">
        Purchased Date: {purchased_date}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="left">
        Amount Purchased: {amount_purchased}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="left">
        Department: {department}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="left">
        Location: {location}
      </Typography>
    </>
  );
}
