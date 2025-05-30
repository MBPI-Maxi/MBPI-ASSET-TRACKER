import { memo } from "react";
import { handleExport } from "@/helpers/helper";
import { Print, FileDownload } from '@mui/icons-material';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// Wrap StackButtonDesign with React.memo
const StackButtonDesign = memo(function StackButtonDesign({ label, startIcon, onClickHandler, ...props }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button 
        variant="contained" 
        startIcon={startIcon} 
        onClick={onClickHandler} 
        {...props} 
      >
        { label }
      </Button>
    </Stack>
  );
});

// Wrap PrintButton with React.memo
export const PrintButton = memo(function PrintButton({ handlePrint }) {
  return (
    <StackButtonDesign
      label="Print"
      startIcon={<Print />}
      onClickHandler={handlePrint}
    />
  );
});

// Wrap ExportToExcel with React.memo
export const ExportToExcel = memo(function ExportToExcel({ data, fileName, exportType }) {
  return (
    <StackButtonDesign
      label="Export"
      startIcon={<FileDownload />}
      onClickHandler={() => handleExport(data, fileName, exportType)}
      disabled={fileName === "maintenance_report_summary"}
    />
  );
});
