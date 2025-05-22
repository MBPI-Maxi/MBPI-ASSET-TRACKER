import {
  Table,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

import {
  TableHeadCreate,
  ShowNoRecordsFound,
  DepartmentPurchasedSummaryBody
} from "@/components/TableHelpers";


// make this table into reusable code in the future
function TableSummary({ data }) {
  const rows = data;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHeadCreate
          tableCell={["Department", "Total Assets Purchased", "Total Expenditure", "Most Purchased Asset Type"]}
          keyName="dptPurchasedSummaryHeader"
          alignment="right"
        />

        <TableBody>
          {
            rows.length === 0
              ? <ShowNoRecordsFound />
              : <DepartmentPurchasedSummaryBody
                tableCell={data}
                keyName="dptPurchasedSumamryBody"
                alignment="right"
              />
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableSummary;
