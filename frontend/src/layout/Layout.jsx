import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <section>
        <img src="logo.png" alt="mbpi-logo" width="120px" height="70px" />
        <Navbar />
      </section>
      
      <section className="container">
        <Outlet />
      </section>
    </>
  );
}

export default Layout;
