import { useState } from "react";
import "../../App.css"
import { Link } from "react-router-dom";
import {post, getCookie} from '../../functions'




const TeacherNavbar = () => {
    const [admin, setAdmin] = useState(false)

    const priv = async () => {
        const sessionid = getCookie("sessionId").toString();
        const userid = getCookie("userId").toString();
        const body = { sessionid, userid };
        const response = await post('/getUser', body)
        console.log('response: ', JSON.stringify({...response}))
        if(response.privilege !== 2){
            setAdmin(false)
            console.log(admin)
        }else if (response.privilege === 2) {
            setAdmin(true);
            console.log(admin)
        }
    }
    priv()

    return (
        <div className="lkNavbarDiv">
            <ul className="lkNavbar">
                <li className="lkNavbar">
                    <Link to="../leerkracht/overzicht"><img src={require('../../images/Dashboard.png')} alt="Dashboard" className="lkNavbar" /></Link>
                </li>
                <br />
                <li className="lkNavbar">
                    <Link to="../leerkracht/leerlingen"><img src={require('../../images/Graduates.png')} alt="Leerlingen" className="lkNavbar" /></Link>
                </li>
                <br />
                <li className="lkNavbar">
                    <Link to="../leerkracht/bibliotheek"><img src={require('../../images/book.png')} alt="Bibliotheek" className="lkNavbar" /></Link>
                </li>
                <br />
                <li className="lkNavbar">
                    <Link to='../leerkracht/verander-wachtwoord'>verander wachtwoord</Link>
                </li>
                <br />
            {admin ? <ul> <li className="klNavbar">
                    <Link to='../beheer/gebruikers-beheren'>gebruikers beheren</Link>
                </li>
                <br />
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
                </li></ul>:<div/>}
            </ul>
        </div>
    );
}

export default TeacherNavbar;