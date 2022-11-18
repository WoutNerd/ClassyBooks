import "./App.css";
import {  Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>Bibflix</h1>
            <Link className="link" to="/">Thuis</Link>
            <Link className="link" to="/about">Over Ons</Link>
        </nav>
     );
}
 
export default Navbar;