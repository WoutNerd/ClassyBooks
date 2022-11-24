import "../App.css"
const TeacherNavbar = () => {

    return ( 
        <div className="lkNavbarDiv">
            <ul className="lkNavbar">
                <li className="lkNavbar">
                    <img src={require('../images/Dashboard.png')} alt="Dashboard" className="lkNavbar"/>
                </li>
                <br />
                <li className="lkNavbar">
                    <img src={require('../images/Graduates.png')} alt="Leerlingen" className="lkNavbar"/>
                </li>
                <br />
                <li className="lkNavbar">
                    <img src={require('../images/book.png')} alt="Bibliotheek" className="lkNavbar"/>
                </li>
            </ul>
       </div>
     );
}
 
export default TeacherNavbar;