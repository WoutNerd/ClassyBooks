import { useState } from "react";
import "../../App.css"
import { Link } from "react-router-dom";
import { post, getCookie } from '../../functions'
const classNames = require('classnames')

function getCurrentURL () { 
    return window.location.pathname
  }


const TeacherNavbar = () => {
    const [admin, setAdmin] = useState(false)
    const currentUrl = getCurrentURL()


    var dashboard = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/leerkracht/overzicht'
      });
      var pupils = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/leerkracht/leerlingen'
      });
      var library = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/leerkracht/bibliotheek'
      });
      var pass = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/leerkracht/verander-wachtwoord'
      });
      var users = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/beheer/gebruikers-beheren'
      });
      var addUser = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/beheer/gebruiker-toevoegen'
      });
      var books = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/beheer/boeken-beheren'
      });
      var addBook = classNames({
        'lkNavbar': true,
        'active': currentUrl === '/beheer/boek-toevoegen'
      });


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
            <ul className="">
                    <li className={dashboard}>
                        <Link to="../leerkracht/overzicht">Dashboard</Link>
                    </li>

                    <li className={pupils}>
                        <Link to="../leerkracht/leerlingen">Leerlingen</Link>
                    </li>

                    <li className={library}>
                        <Link to="../leerkracht/bibliotheek">Bibliotheek</Link>
                    </li>

                    <li className={pass}>
                        <Link to='../leerkracht/verander-wachtwoord'>Verander wachtwoord</Link>
                    </li>
                
            {admin ?<>

                    <li className={users}>
                        <Link to='../beheer/gebruikers-beheren'>Gebruikers beheren</Link>
                    </li>
                    <li className={addUser}>
                        <Link to='../beheer/gebruiker-toevoegen'>Gebruiker toevoegen</Link>
                    </li>
                    <li className={books}>
                        <Link to='../beheer/boeken-beheren'>Boeken beheren</Link>
                    </li>
                    <li className={addBook}>
                        <Link to='../beheer/boek-toevoegen'>Boek toevoegen</Link>
                    </li> </>
                     : <></>}
                     </ul>

        </div>
    );
}

export default TeacherNavbar;