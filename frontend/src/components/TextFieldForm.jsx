import TextField from "@mui/material/TextField";

export function DefaultTextFieldStyle({ ...props }) {
  return (
    <TextField
      fullWidth
      margin="normal"
      {...props}
    >
    </TextField>
  )
}
