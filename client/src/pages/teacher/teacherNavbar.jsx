import "../../App.css"
import { Link } from "react-router-dom";
const TeacherNavbar = () => {

    return ( 
        <div className="lkNavbarDiv">
            <ul className="lkNavbar">
                <li className="lkNavbar">
                    <Link href="./overzicht"><img src={require('../../images/Dashboard.png')} alt="Dashboard" className="lkNavbar" /></Link>
                </li>
                <br />
                <li className="lkNavbar">
                    <Link href="/leerlingen"><img src={require('../../images/Graduates.png')} alt="Leerlingen" className="lkNavbar"/></Link>
                </li>
                <br />
                <li className="lkNavbar">
                    <Link href="./bibliotheek"><img src={require('../../images/book.png')} alt="Bibliotheek" className="lkNavbar"/></Link>
                </li>
            </ul>
       </div>
     );
}
 
export default TeacherNavbar;