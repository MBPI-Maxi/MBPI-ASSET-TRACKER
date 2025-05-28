import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function QRCodeSelectComponent({ mode, setMode }) {
  const handleMode = (event) => {
    setMode(event.target.value);
  }

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="qrcode-scanner">
        Select Mode
      </InputLabel>
      <Select
        labelId="qrcode-scanner"
        value={mode}
        label="Select Mode"
        onChange={handleMode}
      >
        <MenuItem value="Phone/Webcam">
          Phone/Webcam
        </MenuItem>
        <MenuItem value="QRCodeDevice">
          QR Code Device
        </MenuItem>
      </Select>
    </FormControl>
  );
}
