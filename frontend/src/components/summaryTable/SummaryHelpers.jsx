import { addCommasToNumber } from "@/helpers/helper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const AssetScanSummary = ({
  nameSummaryReport,
  missingAssetCount,
  totalMissingValue
}) => {
  if (nameSummaryReport === "asset-scan-verification-report") {

    return (
      <Box>
        <Typography fontWeight={700}>
          Missing Asset: {missingAssetCount}
        </Typography>
        <Typography fontWeight={700}>
          Total Missing Value: {addCommasToNumber(totalMissingValue)}
        </Typography>
      </Box>
    );
  }

  return null;
}

export const MaintenanceScanReport = ({
  nameSummaryReport,
  totalMaintenanceValue
}) => {
  if (nameSummaryReport === "maintenance-report-summary") {
    return (
      <Box>
        <Typography fontWeight={700}>
          Total Maintenance Value: { addCommasToNumber(totalMaintenanceValue) }
        </Typography>
      </Box>
    );
  }
}