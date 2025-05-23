import API_ROUTES from "@/api/api";
import DepreciationLayout from "@/layout/DepreciationLayout";

export default function DepreciationTable() {
  return (
    <DepreciationLayout 
      title="Depreciation Report"
      apiFunc={API_ROUTES.getDepreciation}
      endpoint="depreciation-report/list"
      snackBarMessage="Error fetching depreciation data"
      nameSummaryReport="depreciation-report"
      fileNameStr="depreciation_report"
    />
  );
}