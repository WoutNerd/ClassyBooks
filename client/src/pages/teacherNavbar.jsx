import "../App.css"
const TeacherNavbar = () => {

    return ( 
        <div className="lkNavbarDiv">
            <ul className="lkNavbar">
                <li className="lkNavbar">
                    <a href="./overzicht"><img src={require('../images/Dashboard.png')} alt="Dashboard" className="lkNavbar" /></a>
                </li>
                <br />
                <li className="lkNavbar">
                    <a href="/leerlingen"><img src={require('../images/Graduates.png')} alt="Leerlingen" className="lkNavbar"/></a>
                </li>
                <br />
                <li className="lkNavbar">
                    <a href="./bibliotheek"><img src={require('../images/book.png')} alt="Bibliotheek" className="lkNavbar"/></a>
                </li>
            </ul>
       </div>
     );
}
 
export default TeacherNavbar;