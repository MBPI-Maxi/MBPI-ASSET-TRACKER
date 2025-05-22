import { TableHead, TableRow, TableCell, TablePagination } from "@mui/material";

/**
 * Renders a table header row using Material UI components.
 *
 * @param {Object} props - The component props.
 * @param {string[]} props.tableCell - An array of strings representing the column headers.
 * @param {string} props.keyName - A base string used to generate unique keys for each header cell.
 * @param {'inherit' | 'left' | 'center' | 'right' | 'justify'} [props.alignment='left'] - Text alignment for each table cell.
 *
 * @returns {JSX.Element} The rendered table header row.
 */
export function TableHeadCreate({ tableCell, keyName, alignment }) {
  return (
    <TableHead>
      <TableRow>
        {
          tableCell.map((name, index) => {
            let key = `${keyName}-${index}`;
            return <TableCell key={key} align={alignment}>
              {name}
            </TableCell>
          })
        }
      </TableRow>
    </TableHead>
  );
}

/**
 * Displays a single table row indicating that no records were found.
 *
 * @returns {JSX.Element} A table row with a message indicating no data is available.
 */
export function ShowNoRecordsFound() {
  return (
    <TableRow>
      <TableCell colSpan={4} align="center">
        No Records found.
      </TableCell>
    </TableRow>
  );
}

/**
 * Renders the table body rows for the department purchase summary.
 *
 * @param {Object} props - The component props.
 * @param {Object[]} props.tableCell - An array of department summary data objects.
 * @param {string} props.keyName - A base string used to generate unique keys for each row.
 * @param {'inherit' | 'left' | 'center' | 'right' | 'justify'} [props.alignment='left'] - Text alignment for each table cell.
 *
 * @returns {JSX.Element} The rendered table rows.
 */
export function DepartmentPurchasedSummaryBody({ tableCell, keyName, alignment }) {
  return (
    <>
      {
        tableCell.map((row, index) => {
          let key = `${keyName}-${index}`;
          const { department, total_assets_purchased, total_expenditure, total_asset_type } = row;

          return <TableRow key={key}>
            <TableCell align={alignment}>
              { department }
            </TableCell>
            <TableCell align={alignment}>
              { total_assets_purchased }
            </TableCell>
            <TableCell align={alignment}>
              { total_expenditure.toLocaleString() }
            </TableCell>
            <TableCell align={alignment}>
              { total_asset_type }
            </TableCell>
          </TableRow>
        })
      }
    </>
  );
}
