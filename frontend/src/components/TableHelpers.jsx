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
export function ShowNoRecordsFound({ colSpan = 4 }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
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
              { total_expenditure.toLocaleString() || total_expenditure }
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

/**
 * Renders the table body rows for the Asset Scan Verification Summary Report.
 *
 * This component maps through the provided asset scan data and displays relevant
 * information in a table format. It includes fields such as asset ID, item name,
 * expected location, scan status, last seen timestamp, user information, value, 
 * and days missing.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.tableCell - Array of asset data objects to display.
 * @param {string} props.keyName - A unique prefix for generating row keys.
 * @param {'left' | 'center' | 'right'} props.alignment - Text alignment for all table cells.
 *
 * @returns {JSX.Element} A fragment containing one or more `<TableRow>` elements populated with asset data.
 *
 * @example
 * <AssetScanVerificationSummaryBody
 *   tableCell={[{ asset_id: 'AST-1', item_name: 'Monitor', ... }]}
 *   keyName="assetScan"
 *   alignment="right"
 * />
 */
export function AssetScanVerificationSummaryBody({ tableCell, keyName, alignment }) {
  return (
    <>
      {
        tableCell.map((row, index) => {
          let key = `${keyName}-${index}`;

          const { 
            asset_id, 
            item_name, 
            expected_location, 
            status, 
            last_seen, 
            generated_by,
            updated_by, 
            value, 
            days_missing
           } = row;

           return <TableRow key={key}>
            <TableCell align={alignment}>
              {asset_id}
            </TableCell>
            <TableCell align={alignment}>
              {item_name}
            </TableCell>
            <TableCell align={alignment}>
              {expected_location}
            </TableCell>
            <TableCell align={alignment}>
              {status}
            </TableCell>
            <TableCell align={alignment}>
              {last_seen}
            </TableCell>
            <TableCell align={alignment}>
              {generated_by}
            </TableCell>
            <TableCell align={alignment}>
              {updated_by}
            </TableCell>
            <TableCell align={alignment}>
              {value.toLocaleString() || value}
            </TableCell>
            <TableCell align={alignment}>
              {days_missing}
            </TableCell>
           </TableRow>
        })
      }
    </>
  );
}

export function LabelGenerationSummaryBody({ tableCell, keyName, alignment }) {
  return (
    <>
      {
        tableCell.map((row, index) => {
          let key = `${keyName}-${index}`;
          
          const {
            asset_id,
            tag_type,
            generated_by,
            timestamp,
            remarks,
          } = row;

          return <TableRow key={key}>
            <TableCell align={alignment}>
              {asset_id}
            </TableCell>
            <TableCell align={alignment}>
              {tag_type}
            </TableCell>
            <TableCell align={alignment}>
              {generated_by}
            </TableCell>
            <TableCell align={alignment}>
              {timestamp}
            </TableCell>
            <TableCell align={alignment}>
              {remarks}
            </TableCell>
          </TableRow>
        })
      }
    </>
  );
}

export function DepreciationTableSummaryBody({ tableCell, keyName, alignment }) {
  return (
    <>
      {
        tableCell.map((row, index) => {
          let key = `${keyName}-${index}`;
          const {
            original_cost,
            asset_age_years,
            annual_depreciation,
            annual_depreciation_pct,
            depreciated_value,
            current_depreciation_pct,
            current_value,
            depreciation_method,
            useful_life,
            asset_id,
            item_name
          } = row;

          return <TableRow key={key}>
            <TableCell align={alignment}>
              { asset_id }
            </TableCell>
            <TableCell align={alignment}>
              { item_name }
            </TableCell>
            <TableCell align={alignment}>
              { original_cost }
            </TableCell>
            <TableCell align={alignment}>
              { asset_age_years }
            </TableCell>
            <TableCell align={alignment}>
              { annual_depreciation }
            </TableCell>
            <TableCell align={alignment}>
              { annual_depreciation_pct }
            </TableCell>
            <TableCell align={alignment}>
              { depreciated_value }
            </TableCell>
            <TableCell align={alignment}>
              { current_depreciation_pct }
            </TableCell>
            <TableCell align={alignment}>
              { current_value }
            </TableCell>
            <TableCell align={alignment}>
              { depreciation_method }
            </TableCell>
            <TableCell align={alignment}>
              { useful_life }
            </TableCell>
          </TableRow>
        })
      }
    </>
  );
}