/**
 * MATCH YOUR VALUE ATTRIBUTE TO THE DEPARTMENT DATABASE VALUE.
 */

function DepartmentDropBox({...props}) {
    return (
        <select name="dpt-field" {...props} required>
            <option value="department">Department</option> 
            <option value="IT">IT</option>
            <option value="PRODUCTION DEPARTMENT">Production Department</option>
            <option value="UTILITY MAINTENANCE">Utility Maintenance</option>
            <option value="LAB DEPARTMENT">Lab Department</option>
            <option value="WAREHOUSE DEPARTMENT">Warehouse Department</option>
            <option value="PRODUCTION MAINTENANCE">Production Maintenance</option>
        </select>
    )
}

export default DepartmentDropBox;