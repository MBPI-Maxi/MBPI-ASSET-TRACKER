import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";

export default function CameraSelectComponent({ selectedDeviceId, setSelectedDeviceId }) {
  const [devices, setDevices] = useState([]);

  const handleChange = (event) => {
    setSelectedDeviceId(event.target.value);
  }

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((device) => device.kind === "videoinput");

        setDevices(videoDevices);

        if (!selectedDeviceId && videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }

      } catch (error) {
        console.error(error);
      }
    }

    fetchDevices();
  }, [selectedDeviceId, setSelectedDeviceId])

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="camera-select-label">Select Camera</InputLabel>

      {
        devices.length > 0 ? (
          <Select
            labelId="camera-select-label"
            value={selectedDeviceId || ""}
            onChange={handleChange}
            label="Select Camera"
          >
            {
              devices.map((device, index) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </MenuItem>
              ))
            }
          </Select>
        ) : (
          // Optional: show a disabled select while loading
          <Select disabled value="">
            <MenuItem value="">Loading...</MenuItem>
          </Select>
        )
      }
    </FormControl>
  );
}
