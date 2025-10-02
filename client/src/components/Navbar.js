import "../App.css";
import { useNavigate } from "react-router-dom";
import { checkUser, getCookie, post } from '../functions.js'
import { useState } from "react";
const logo_long = require('../art/logo_long.png')



const Navbar = () => {
    const [user, setUser] = useState(null)
    const [home, setHome] = useState('/')
    const navigate = useNavigate();
    const redirectToPage = (path) => {
        navigate(path); // Use navigate to go to the specified path
    };
    function handleLogOut() {
        const body = { sessionId: getCookie("sessionId") }
        post('/logout', body, 'navbar')
        document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        priv()
        redirectToPage('../#')
    }
    checkUser()
    function handleHome() {
        redirectToPage(home)
    }

    function handleAbout() {
        window.open('https://github.com/WoutNerd/ClassyBooks/blob/main/handleidingen.md', '_blank');
    }

    const priv = async () => {
        const sessionid = getCookie("sessionId");
        const userid = getCookie("userId");
        const body = { sessionid, userid };
        const response = await post('/getUser', body, 'navbar')
        if (response.ok === false) {
            setUser(false)
            setHome('../#')
        } else if (response != null) {
            setUser(true);
            if (response.privilege === 2) setHome('../beheer/gebruikers-beheren')
            else if (response.privilege === 1) setHome('../leerkracht/overzicht')
            else if (response.privilege == null) setHome('../leerling/bibliotheek')
        } else {
            const type = typeof (response)
            console.log(type)
        }
    }
    priv()
    return (
        <nav className="navbar">
            <img src={logo_long} alt="ClassyBooks"></img>
            <br />
            <button className="navbtn" onClick={() => { handleHome() }}>Thuis</button>
            <button className="navbtn" onClick={() => { handleAbout() }}>Over Ons</button>
            {user ? <>
                <button className="navbtn" onClick={() => { handleLogOut() }}>Afmelden</button>
            </> : <></>}
        </nav>
    );
}

export default Navbar;