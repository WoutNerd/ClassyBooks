import "../App.css"
import TeacherNavbar from "./teacherNavbar";

const Dashboard = () => {
    return ( 
        <div>
            <nav className="navbar">
                <TeacherNavbar/>
            </nav>
            <main>
                <table className="inventory">
                    <caption>
                        Inventaris
                    </caption>
                    <tr>
                        <th>{"aantal boeken"}</th>
                        <th>{"aantal kopieëen"}</th>
                        <th>{"aantal leerlingen"}</th>
                    </tr>
                    <tr>
                        <td>boeken</td>
                        <td>kopieëen</td>
                        <td>leerlingen</td>
                    </tr>
                </table>
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