import API_ROUTES from "@/api/api";
import SummaryLayout from "@/layout/SummaryLayout";

export default function LabelGenerationTable() {
  return (
    <SummaryLayout 
      title="Label Generation Report"
      apiFunc={API_ROUTES.getSummaries}
      endpoint="label-generation-log"
      nameSummaryReport="label-generation-report"
      queryKeyString="labelGenerationReport"
      fileNameStr="label_generation_report"
    />
  );
}