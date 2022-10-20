import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>Bibflix</h1>
            <Link to="/">Thuis</Link>
            <Link to="/about">Over Ons</Link>
        </nav>
     );
}
 
export default Navbar;