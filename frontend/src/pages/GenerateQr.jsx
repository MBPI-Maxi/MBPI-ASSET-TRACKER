import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import axios from "axios";

function GenerateQr() {
    // left-side yung mga fields tapos yung right side yung generation ng QR code
    const [optionValue, setOptionValue] = useState("");

    // const handleClick = () => {
    //     const value = itemReference.current.value;
    //     const pngEndpoint = value + ".png";
    //     setOptionValue(pngEndpoint);
    // }

    return (
        <div className="generate-qr-ctn">
            <div>
                <AssetGeneration setOptionValue={setOptionValue} />
            </div>
            <div>
                {/* <button onClick={handleClick}>Generate QR</button> */}
                <QrBox optionValue={optionValue} />
            </div>
        </div>
    )
}

function AssetGeneration({ setOptionValue }) {
    const { data, error, isLoading } = useQuery({
        queryKey: ["assetData"],
        queryFn: async () => {
            const url = "http://127.0.0.1:8000/api/asset/list";
            const response = await axios.get(url);

            return response.data;
        }
    })

    if (isLoading) return <div>Loading items...</div>
    if (error) alert("Error in fetching items");

    const handleChange = (e) => {
        const value = e.target.value;
        const pngEndpoint = value + ".png";
        setOptionValue(pngEndpoint);
    }

    return (
        <div>
            <select
                name="select-items-qr"
                className="select-item"
                // ref={itemRef}
                onChange={handleChange}
                required
            >
                <option value="select-item-name">Select Item</option>
                {
                    data.map((objects, index) => {
                        const {
                            asset_id,
                            item_name,
                            department,
                            brand
                        } = objects

                        let itemUpper = item_name.toUpperCase();
                        let departmentUpper = department.toUpperCase();
                        let brandUpper = brand.toUpperCase();
                        let assetIdUpper = `AST_${asset_id}`;

                        return <option key={index} value={assetIdUpper}>
                            {`${itemUpper} | ${departmentUpper} | ${brandUpper} | ${assetIdUpper}`}
                        </option>
                    })
                }
            </select>
        </div>
    )
}

function QrBox({ optionValue }) {
    const backendRoute = "http://127.0.0.1:8000/media/qr_codes/" + optionValue;

    return (
        <div className="qr-box">
            {
                optionValue === "select-item-name.png"
                    ? null
                    : <img src={backendRoute} alt="QRCode" style={{ width: "200px", height: "200px", objectFit: "contain" }} />
            }
        </div>
    )
}

export default GenerateQr;