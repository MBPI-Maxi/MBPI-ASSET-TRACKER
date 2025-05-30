import API_ROUTES from "@/api/api";
import SummaryLayout from "@/layout/SummaryLayout";
import { SummaryInstruction } from "../alerts";

export default function AssetScanVerificationTable() {
  return (
    <>
      <SummaryInstruction />
      <SummaryLayout
        title="Asset Scan Verification Report"
        apiFunc={API_ROUTES.getSummaries}
        endpoint="scan-verification-report"
        nameSummaryReport="asset-scan-verification-report"
        queryKeyString="scanVerificationReport"
        fileNameStr="asset_verification_summary_report"
      />
    </>
  );
}