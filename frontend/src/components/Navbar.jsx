import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/">Add Asset</NavLink>
        </li>
        <li>
        <NavLink to="/update">Update Item Details</NavLink>   
        </li>
        <li>
          <NavLink to="/generate_qr">Generate QR Code</NavLink>
        </li>
        <li>
          <NavLink to="/test">Report Summary</NavLink>
        </li>
        <li>
          <NavLink to="/find">Find Item</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
