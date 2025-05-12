import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function TableQR({ onRowClick }) {
  const items = [
    { id: "123", name: "Printer" },
    { id: "456", name: "Router" },
  ];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Item ID</TableCell>
          <TableCell>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {/* items will be fetch here */}
        {items.map((item) => (
          <TableRow
            key={item.id}
            hover
            onClick={() => onRowClick(item)}
            sx={{ cursor: "pointer" }}
          >
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
