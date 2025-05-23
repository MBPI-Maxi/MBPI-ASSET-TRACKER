import API_ROUTES from '@/api/api';
import SummaryLayout from '@/layout/SummaryLayout';

export default function DepartmentSummaryTable() {
  return (
    <SummaryLayout 
      title="Department Purchased Summary"
      apiFunc={API_ROUTES.getSummaries}
      endpoint="dept-purchased-summary"
      nameSummaryReport="dept-purchased-summary"
      queryKeyString="departmentSummary"
      snackBarMessage="Error fetching department purchased summary"
      fileNameStr="department_purchased_summary"
    />
  );
}
