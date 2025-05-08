import DepartmentDropBox from "../components/DepartmentDropBox";
import { useState, useRef, useEffect } from "react";

import createAssetCall from "../api/handleAsset";

function CreateAsset() {
    const [data, setData] = useState({
        itemNameField: "",
        brandField: "",
        purchaseDateField: "",
        amountField: "",
        isActive: false
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

    const handleCheckBox = (e) => {
        const isActive = e.target.checked; // boolean
        console.log(isActive)

        setData(prevState => {
            return { ...prevState, isActive: isActive }
        })
    }

    const mutation = createAssetCall()
    
    let payload;
    const handleSubmit = () => {
        const department = selectRef.current.value;
        
        // match this to the postman api structure
        payload = {
            department: department,
            item_name: data.itemNameField,
            brand: data.brandField,
            amount_purchased: data.amountField,
            amount: data.amountField,
            is_active: data.isActive
        }

        if (data.purchaseDateField) {
            payload.purchase_date = data.purchaseDateField;
        }

        mutation.mutate(payload, {
            onError: (err) => {
                const errorDetails = err.response.data;

                alert(JSON.stringify(errorDetails));
            }
        });
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            alert(`Asset created successfully!\n ${JSON.stringify(payload)}`);
            
            // reset the fields and the data state
            mutation.reset()
            setData({
                itemNameField: "",
                brandField: "",
                purchaseDateField: "",
                amountField: "",
                isActive: null
            });
        }
    }, [mutation.isSuccess]);

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
            <div>
                <label htmlFor="isActive">Active:</label>
                <input type="checkbox" id="isActive" onChange={handleCheckBox} />
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