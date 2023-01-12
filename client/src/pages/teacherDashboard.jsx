import "../App.css"
import TeacherNavbar from "./teacherNavbar";

const Dashboard = () => {
var books = 0
var copies = 0
var students = 0
var studentBooks = 0
var checkedOut = 0
var overdue = 0
    return ( 
        <div className="grid">
            <nav className="navbar">
                <TeacherNavbar/>
            </nav>
            <main>
                <div className="inventory">
                    <h3 className="caption">Inventaris</h3>
                    <div className="books">
                        <h1>{books}</h1>
                        <p>boeken</p>
                    </div>
                    <div className="copies">
                        <h1>{copies}</h1>
                        <p>kopieëen</p>
                    </div>
                    <div className="students">
                        <h1>{students}</h1>
                        <p>leerlingen</p>
                    </div>
                </div>
                <div className="manage">
                    <h3 className="caption">Beheer</h3>
                    <div className="studentBooks">
                        <h1>{studentBooks}</h1>
                        <p>Leerlingen met boeken</p>
                    </div>
                    <div className="overdue">
                        <h1>{overdue}</h1>
                        <p>boeken overtijd</p>
                    </div>
                    <div className="checkedOut">
                        <h1>{checkedOut}</h1>
                        <p>Boeken uitgecheckt</p>
                    </div>
                </div>
            </main>
        </div>
     );
}
 
export default Dashboard;