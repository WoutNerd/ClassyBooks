import "../App.css"
import TeacherNavbar from "./teacherNavbar";

const Dashboard = () => {
    return ( 
        <div>
            <nav className="navbar">
                <TeacherNavbar/>
            </nav>
            <main>
                <div className="inventory">
                    <h2>Inventaris</h2>
                    <div className="books">
                        <h3>{"aantal boeken"}</h3>
                        <p>boeken</p>
                    </div>
                    <div className="copies">
                        <h3>{"aantal kopieëen"}</h3>
                        <p>kopieëen</p>
                    </div>
                    <div className="students">
                        <h3>{"aantal studenten"}</h3>
                        <p>studenten</p>
                    </div>
                </div>
                <div className="manage">
                    <h2>Beheer</h2>
                    <div className="checkedOut">
                        <h3>{"aantal boeken uitgeleend"}</h3>
                        <p>boeken uitgeleend</p>
                    </div>
                    <div className="studentBooks">
                        <h3>{"aantal leerlingen met boeken"}</h3>
                        <p>leerlingen met boeken</p>
                    </div>
                    <div className="overdue">
                        <h3>{"aantal boeken overtijd"}</h3>
                        <p>boeken overtijd</p>
                    </div>
                </div>
            </main>
        </div>
     );
}
 
export default Dashboard;