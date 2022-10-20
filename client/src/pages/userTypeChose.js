import {Link} from "react-router-dom"
import "../App.css"

const UserTypeChose = () => {

    const leerkracht = () => {
        console.log('leerkracht');
        
    }

    const leerling = () => {
        console.log('leerling');
        <Link to="/leerling" />
    }

    return ( 
        <div className="userTypeChose">
            <Link to="/leerkracht" className="button">Leerkracht</Link>
            <Link to="/leerling" className="button">Leerling</Link>
        </div>
     );
}
 
export default UserTypeChose;