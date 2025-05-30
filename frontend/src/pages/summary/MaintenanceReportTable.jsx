import API_ROUTES from "@/api/api";
import SummaryLayout from "@/layout/SummaryLayout";

export default function MaintenanceReportTable() {
  return (
    <SummaryLayout 
      title="Maintenance Report Summary"
      apiFunc={API_ROUTES.getSummaries}
      endpoint="maintenance-report/list"
      nameSummaryReport="maintenance-report-summary"
      queryKeyString="maintenanceReport"
      snackBarMessage="Error fetching maintenance report summary"
      fileNameStr="maintenance_report_summary"
    />
  );
}