import "./App.css";
import {  Link, useNavigate } from "react-router-dom";
import {getCookie, post} from './functions.js'
import { useState } from "react";
const logo_long = require('./art/logo_long.png')



const Navbar = () => {
    const [user, setUser] = useState(null) 
    const [home, setHome] = useState('/')
    const navigate = useNavigate();
    const redirectToPage = (path) => {
      navigate(path); // Use navigate to go to the specified path
    };
    function handleClick() {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        priv()
        redirectToPage('../#')
    }
 
    const priv = async () => {
        const sessionid = getCookie("sessionId");
        const userid = getCookie("userId");
        const body = { sessionid, userid };
        const response = await post('/getUser', body)
        if (typeof(response) === 'undefined') {
            setUser(false)
        } else if (typeof(response) === 'object') {
            setUser(true);
            if (response.privilege === 2) setHome('../beheer/gebruikers-beheren')
            else if (response.privilege === 1) setHome('../leerkracht/overzicht')
            else if (response.privilege === null) setHome('../leerling/bibliotheek')
        }else {
            const type = typeof(response)
            console.log(type)
        }
    }
    priv()
    return ( 
        <nav className="navbar">
            <img src={logo_long} alt="ClassyBooks"></img>
            <br/>
            <Link className="navbtm" to={home}>Thuis</Link>
            <Link className="navbtn" to="/about">Over Ons</Link>
            {user ? <>
            <button className="navbtn" onClick={() => {handleClick()}}>Afmelden</button>
            </>: <></>}
        </nav>
     );
}
 
export default Navbar;