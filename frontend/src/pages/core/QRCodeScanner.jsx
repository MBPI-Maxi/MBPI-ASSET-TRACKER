import { useEffect, useState } from "react";
import { qrcodeRegionId, qrCodeCreateConfig } from "@/constants/qrcodeConstant";
import QRCodeSelectComponent from "@/components/qrcode/SelectComponent";

function QRCodeScanner() {
  const [mode, setMode] = useState("Phone/Webcam");
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log(decodedText);
    console.log(decodedResult);
  }

  return (
    <>
      <QRCodeSelectComponent mode={mode} setMode={setMode} />

      

    </>
  );
}

export default QRCodeScanner;