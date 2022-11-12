import {Link} from "react-router-dom"
import "../App.css"

const UserTypeChose = () => {

    return ( 
        <div className="userTypeChose">
            <Link to="/leerkracht" className="button">Leerkracht</Link>
            <Link to="/klas" className="button">Leerling</Link>
        </div>
     );
}

export default UserTypeChose;