import { useState } from "react";
import "../../App.css"
import { Link } from "react-router-dom";
import { post, getCookie } from '../../functions'




const TeacherNavbar = () => {
    const [admin, setAdmin] = useState(false)

    const priv = async () => {
        const sessionid = getCookie("sessionId");
        const userid = getCookie("userId");
        const body = { sessionid, userid };
        const response = await post('/getUser', body)
        if (response.privilege !== 2) {
            setAdmin(false)
        } else if (response.privilege === 2) {
            setAdmin(true);
        }
    }
    priv()

    return (
        <div className="lkNavbarDiv">
            
            {admin ?
                <ul className="lkNavbar">
                    <li className="lkNavbar">
                        <Link to="../leerkracht/overzicht">Dashboard</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to="../leerkracht/leerlingen">Leerlingen</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to="../leerkracht/bibliotheek">Bilbiotheek</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to='../leerkracht/verander-wachtwoord'>verander wachtwoord</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to='../beheer/gebruikers-beheren'>gebruikers beheren</Link>
                    </li>
                    <br/>
                    <li className="lkNavbar">
                        <Link to='../beheer/gebruiker-toevoegen'>gebruiker toevoegen</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to='../beheer/boeken-beheren'>boeken beheren</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to='../beheer/boek-toevoegen'>boek toevoegen</Link>
                    </li>
                    </ul> : <ul className="lkNavbar">
                    <li className="lkNavbar">
                        <Link to="../leerkracht/overzicht">Dashboard</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to="../leerkracht/leerlingen">Leerlingen</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to="../leerkracht/bibliotheek">Bilbiotheek</Link>
                    </li>
                    <br />
                    <li className="lkNavbar">
                        <Link to='../leerkracht/verander-wachtwoord'>verander wachtwoord</Link>
                    </li>
                </ul>}

        </div>
    );
}

export default TeacherNavbar;