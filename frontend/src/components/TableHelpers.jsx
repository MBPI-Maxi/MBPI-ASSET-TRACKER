// import { TableHead, TableRow, TableCell } from "@mui/material";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Typography, Collapse, Box } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

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
              {department}
            </TableCell>
            <TableCell align={alignment}>
              {total_assets_purchased}
            </TableCell>
            <TableCell align={alignment}>
              {total_expenditure?.toLocaleString() ?? total_expenditure}
            </TableCell>
            <TableCell align={alignment}>
              {total_asset_type}
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

          // let color = status === "Missing" && "red";
          let fontWeight = status === "Missing" && 700;

          return <TableRow key={key} sx={{
            backgroundColor: status === "Missing" ? "rgb(255, 72, 72)" : "inherit"
          }}>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {asset_id}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {item_name}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {expected_location}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {status}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {last_seen}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {generated_by}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {updated_by}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {value?.toLocaleString() ?? value}
            </TableCell>
            <TableCell align={alignment} sx={{fontWeight: fontWeight}}>
              {days_missing}
            </TableCell>
          </TableRow>
        })
      }
    </>
  );
}

/**
 * Renders a table body consisting of rows summarizing label generation details.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {Array<Object>} props.tableCell - An array of objects where each object represents
 *   a row of label generation data, containing the fields: asset_id, tag_type, generated_by, timestamp, and remarks.
 * @param {string} props.keyName - A base string used to construct unique keys for each table row.
 * @param {string} props.alignment - The alignment of content within each table cell (e.g., "left", "center", "right").
 *
 * @returns {JSX.Element} A fragment containing multiple `<TableRow>` elements with corresponding `<TableCell>` components.
 *
 * @example
 * <LabelGenerationSummaryBody
 *   tableCell={[
 *     { asset_id: 'A123', tag_type: 'QR', generated_by: 'Admin', timestamp: '2025-05-27', remarks: 'Initial batch' }
 *   ]}
 *   keyName="label-summary"
 *   alignment="center"
 * />
 */
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

/**
 * Renders a summary table body for asset depreciation details.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {Array<Object>} props.tableCell - An array of objects where each object represents
 *   a row of depreciation data. Each object should include the following fields:
 *   - asset_id: string or number
 *   - item_name: string
 *   - original_cost: number
 *   - asset_age_years: number
 *   - annual_depreciation: number
 *   - annual_depreciation_pct: number (percentage)
 *   - depreciated_value: number
 *   - current_depreciation_pct: number (percentage)
 *   - current_value: number
 *   - depreciation_method: string
 *   - useful_life: number (years)
 * @param {string} props.keyName - A base string used to generate unique keys for each row.
 * @param {string} props.alignment - The alignment of the table cell content ("left", "center", or "right").
 *
 * @returns {JSX.Element} A JSX fragment containing multiple `<TableRow>` elements,
 *   each with `<TableCell>` components displaying asset depreciation information.
 *
 * @example
 * <DepreciationTableSummaryBody
 *   tableCell={[
 *     {
 *       asset_id: 'A101',
 *       item_name: 'Laptop',
 *       original_cost: 50000,
 *       asset_age_years: 2,
 *       annual_depreciation: 10000,
 *       annual_depreciation_pct: 20,
 *       depreciated_value: 20000,
 *       current_depreciation_pct: 40,
 *       current_value: 30000,
 *       depreciation_method: 'Straight Line',
 *       useful_life: 5
 *     }
 *   ]}
 *   keyName="depreciation-summary"
 *   alignment="right"
 * />
 */
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
              {asset_id}
            </TableCell>
            <TableCell align={alignment}>
              {item_name}
            </TableCell>
            <TableCell align={alignment}>
              {original_cost}
            </TableCell>
            <TableCell align={alignment}>
              {asset_age_years}
            </TableCell>
            <TableCell align={alignment}>
              {annual_depreciation}
            </TableCell>
            <TableCell align={alignment}>
              {annual_depreciation_pct}
            </TableCell>
            <TableCell align={alignment}>
              {depreciated_value}
            </TableCell>
            <TableCell align={alignment}>
              {current_depreciation_pct}
            </TableCell>
            <TableCell align={alignment}>
              {current_value}
            </TableCell>
            <TableCell align={alignment}>
              {depreciation_method}
            </TableCell>
            <TableCell align={alignment}>
              {useful_life}
            </TableCell>
          </TableRow>
        })
      }
    </>
  );
}

/**
 * Renders a summary table body for maintenance reports.
 * Each row is expandable to show additional details about the asset, item, and employee involved.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {Array<Object>} props.tableCell - An array of maintenance report objects. Each object includes:
 *   - maintenance_id: string or number
 *   - service_date: string or date
 *   - service_type: string
 *   - cost: number
 *   - status: boolean (true = "Done", false = "Pending")
 *   - asset_detail: object (e.g., { vendor: string })
 *   - item_detail: object (e.g., { item_name: string })
 *   - employee_detail: object (e.g., { first_name: string, last_name: string, email: string|null })
 * @param {string} props.keyName - A base string to generate unique keys for each row.
 * @param {string} props.alignment - Cell content alignment ("left", "center", or "right").
 *
 * @returns {JSX.Element} A fragment containing expandable rows summarizing maintenance reports.
 *
 * @example
 * <MaintenanceReportSummaryBody
 *   tableCell={[{
 *     maintenance_id: 1,
 *     service_date: "2025-05-27",
 *     service_type: "Inspection",
 *     cost: 500,
 *     status: true,
 *     asset_detail: { vendor: "ABC Corp" },
 *     item_detail: { item_name: "Air Conditioner" },
 *     employee_detail: { first_name: "Jane", last_name: "Doe", email: "jane@example.com" }
 *   }]}
 *   keyName="maintenance"
 *   alignment="left"
 * />
 */
export function MaintenanceReportSummaryBody({ tableCell, keyName, alignment }) {
  return (
    <>
      {
        tableCell.map((row, index) => {
          let key = `${keyName}-${index}`;
          return <ExpandableRowForMaintenance key={key} row={row} alignment={alignment} />;
        })
      }
    </>
  )
}

/**
 * Renders a single expandable table row for a maintenance report.
 * Displays basic info and toggles to show additional nested details.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {Object} props.row - A single maintenance report record.
 * @param {string} props.row.maintenance_id - Unique maintenance identifier.
 * @param {string|Date} props.row.service_date - Date of the service.
 * @param {string} props.row.service_type - Type of maintenance service.
 * @param {number} props.row.cost - Cost of the maintenance service.
 * @param {boolean} props.row.status - Status of the service (true = Done, false = Pending).
 * @param {Object} props.row.asset_detail - Details about the associated asset (e.g., vendor).
 * @param {Object} props.row.item_detail - Details about the related item (e.g., item_name).
 * @param {Object} props.row.employee_detail - Details about the responsible employee (e.g., first_name, last_name, email).
 * @param {string} props.alignment - Cell content alignment ("left", "center", or "right").
 *
 * @returns {JSX.Element} A pair of table rows (summary + expandable detail row).
 */
function ExpandableRowForMaintenance({ row, alignment }) {
  const [open, setOpen] = useState(false);
  const {
    maintenance_id,
    service_date,
    service_type,
    cost,
    status,
    asset_detail,
    item_detail,
    employee_detail
  } = row;

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align={alignment}>
          {maintenance_id}
        </TableCell>
        <TableCell align={alignment}>
          {service_date}
        </TableCell>
        <TableCell align={alignment}>
          {service_type}
        </TableCell>
        <TableCell align={alignment}>
          {cost}
        </TableCell>
        <TableCell align={alignment}>
          {status ? "Done" : "Pending"}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                Asset Details:
              </Typography>
              <Typography variant="body2">Vendor: {asset_detail?.vendor}</Typography>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }} fontWeight={700}>
                Item Details:
              </Typography>
              <Typography variant="body2">Item Name: {item_detail?.item_name}</Typography>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }} fontWeight={700}>
                Employee: 
              </Typography>
              <Typography variant="body2">
                {employee_detail?.first_name} {employee_detail?.last_name} - {employee_detail?.email || "No Email"}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}