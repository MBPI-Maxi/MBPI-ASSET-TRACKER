import DepartmentDropBox from "../components/DepartmentDropBox";
import { useState, useRef, useEffect } from "react";

import createAssetCall from "../api/handleAsset";

function CreateAsset() {
    const [data, setData] = useState({
        itemNameField: "",
        brandField: "",
        purchaseDateField: "",
        amountField: "",
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
    };

    const mutation = createAssetCall()
    const handleSubmit = () => {
        const department = selectRef.current.value;
        
        mutation.mutate({
            department: department,
            item_name: data.itemNameField,
            brand: data.brandField,
            amount_purchased: data.amountField,
            amount: data.amountField
        });
    }

    if (mutation.isError) {
        return <p>An error is occurred: {mutation.error.message}</p>
    }

    if (mutation.isSuccess) {
        alert("Data has been successfully added!. ")
    }

    return (
        <section className="asset_ctn">
            <div>
                <h1>Fill up assets:</h1>
            </div>
            <div>
                <label htmlFor="departmentField">Select Department</label>
                <DepartmentDropBox 
                    id="departmentField"
                    ref={selectRef}
                />
            </div>
            <div>
                <label htmlFor="itemNameField">Item name:</label>
                <input 
                    type="text" 
                    id="itemNameField"
                    onChange={handleChange} 
                />
            </div>
            <div>
                <label htmlFor="brandField">Brand:</label>
                <input 
                    type="text" 
                    id="brandField"
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="purchaseDateField">Purchase Date:</label>
                <input 
                    type="date" 
                    id="purchaseDateField"
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="amountField">Amount Purchased (php):</label>
                <input 
                    type="number" 
                    id="amountField" 
                    step="0.01" 
                    onChange={handleChange}
                />
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