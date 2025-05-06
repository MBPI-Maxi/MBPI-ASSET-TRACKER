function DepartmentDropBox({...props}) {
    return (
        <select name="dpt-field" {...props} required>
            <option value="selec-dpt">Select a Department</option> 
            <option value="IT">IT</option>
            <option value="production-department">Production Department</option>
            <option value="utility-maintenance">Utility Maintenance</option>
            <option value="lab-department">Lab Department</option>
            <option value="warehouse-department">Warehouse Department</option>
            <option value="production-maintenance">Production Maintenance</option>
        </select>
    )
}

export default DepartmentDropBox;