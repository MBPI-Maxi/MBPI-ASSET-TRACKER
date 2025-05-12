// src/pages/AddAsset.jsx
import AssetFormCard from "@/components/AssetFormCard";
import AppBarComponent from "@/components/AppBarComponent";
import { useNavigate } from "react-router-dom";


export default function AddAsset() {
  const navigate = useNavigate();

  return (
    <>
      {/* AppBar inside AddAsset */}
      <AppBarComponent />

      {/* AssetFormCard component */}
      <AssetFormCard />
    </>
  );
}


// import { Card, CardContent, CardHeader, Box, Button } from "@mui/material";
// export default function AddAsset() {
//   return (
//     <Box sx={{ display: "flex", flexDirection: "row", gap: 1, maxWidth: 1000, mx: "auto", mt: 4 }}>
//       {/* First Asset Form Card */}
//       <AssetFormCard />

//       {/* Second Card */}
//       <Card sx={{ maxWidth: 350, mx: "auto" }}>
//         <CardHeader title="Additional Information" />
//         <CardContent>
//           <Button variant="contained" color="primary">
//             Submit
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

