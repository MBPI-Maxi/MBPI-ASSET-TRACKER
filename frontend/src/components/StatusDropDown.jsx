function StatusDropDown({...props}) {
    return (
        <select {...props}>
            <option value="active">Active</option>
            <option value="retired">Retired</option>
        </select>
    )
}

export default StatusDropDown;