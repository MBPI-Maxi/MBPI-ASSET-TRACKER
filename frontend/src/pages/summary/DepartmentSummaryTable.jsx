import API_ROUTES from '@/api/api';
import SummaryLayout from '@/layout/SummaryLayout';
import { SummaryInstruction } from '../alerts';

export default function DepartmentSummaryTable() {
  return (
    <>
      <SummaryInstruction />
      <SummaryLayout 
      title="Department Purchased Summary"
      apiFunc={API_ROUTES.getSummaries}
      endpoint="dept-purchased-summary"
      nameSummaryReport="dept-purchased-summary"
      queryKeyString="departmentSummary"
      snackBarMessage="Error fetching department purchased summary"
      fileNameStr="department_purchased_summary"
    />
    </>  
  );
}
