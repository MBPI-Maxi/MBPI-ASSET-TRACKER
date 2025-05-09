import DepartmentDropBox from "../components/DepartmentDropBox";
import { useState, useRef, useEffect } from "react";

import createAssetCall from "../api/handleAsset";

function CreateAsset() {
    const [data, setData] = useState({
        itemNameField: "",
        brandField: "",
        purchaseDateField: "",
        amountField: "",
        isActive: false,
        location: "",
        tagType: ""
    });

    const selectRef = useRef();
    const handleChange = (e) => {
        const { id, value } = e.target;
        setData(prevState => {
            return {
                ...prevState,
                [id]: value
            }
        })

        console.log(data.tagType);
    };

    const handleCheckBox = (e) => {
        const isActive = e.target.checked; // boolean

        setData(prevState => {
            return { ...prevState, isActive: isActive }
        })
    }

    const handleRadioButton = (e) => {
        const value = e.target.value;

        setData(prevState => {
            return { ...prevState, tagType: value };
        })
    }

    const mutation = createAssetCall()

    const handleSubmit = () => {
        const department = selectRef.current.value;

        // create your own payload based on the structure on the backend api required fields
        const payload = {
            "department": department,
            "item_name": data.itemNameField,
            "amount_purchased": data.amountField,
            "is_active": data.isActive,
            "brand": data.brandField,
            "purchased_date": data.purchaseDateField,
            "location": data.location
        }

        if (!data.purchaseDateField) {
            delete payload.purchased_date;
        }

        mutation.mutate(payload, {
            onError: (err) => {
                const errorDetails = err.response.data;
                console.log(payload);
                alert(JSON.stringify(errorDetails));
            }
        });
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            alert(`Asset created successfully!\n `);

            // reset the fields and the data state
            mutation.reset()
            setData({
                itemNameField: "",
                brandField: "",
                purchaseDateField: "",
                amountField: "",
                isActive: false,
                location: ""
            });

            if (selectRef.current) {
                selectRef.current.value = "department";
            }
        }
    }, [mutation.isSuccess]);

    return (
        <section className="asset_ctn">
            <div>
                <h1>Fill up assets:</h1>
            </div>
            <div>
                <label htmlFor="departmentField" className="asset-ctn-outer-lbel">Select Department</label>
                <DepartmentDropBox
                    id="departmentField"
                    ref={selectRef}
                    required
                />
            </div>
            <div>
                <label htmlFor="itemNameField" className="asset-ctn-outer-lbel">Item name:</label>
                <input
                    type="text"
                    id="itemNameField"
                    value={data.itemNameField}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="brandField" className="asset-ctn-outer-lbel">Brand:</label>
                <input
                    type="text"
                    id="brandField"
                    value={data.brandField}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="purchaseDateField" className="asset-ctn-outer-lbel">Purchase Date:</label>
                <input
                    type="date"
                    id="purchaseDateField"
                    value={data.purchaseDateField}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="amountField" className="asset-ctn-outer-lbel">Amount Purchased (php):</label>
                <input
                    type="number"
                    id="amountField"
                    step="0.01"
                    onChange={handleChange}
                    value={data.amountField}
                    required
                />
            </div>
            <div>
                <label htmlFor="location" className="asset-ctn-outer-lbel">Location</label>
                <input
                    type="text"
                    id="location"
                    value={data.location}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="isActive" className="asset-ctn-outer-lbel">Active:</label>
                <input type="checkbox" id="isActive" value={data.isActive} onChange={handleCheckBox} />
            </div>
            <div>
                <label className="asset-ctn-outer-lbel">Tag Type</label>
                <div>
                    <input
                        type="radio"
                        name="tagType"
                        id="qr-radio-type"
                        value="QR"
                        onChange={handleRadioButton}
                    />
                    <label htmlFor="qr-radio-type">QR</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="tagType"
                        id="rfid-radio-type"
                        value="RFID"
                        onChange={handleRadioButton}
                    />
                    <label htmlFor="rfid-radio-type">RFID</label>
                </div>
            </div>
            <button
                className="asset-submit-btn"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </section>
    )
}

export default CreateAsset;