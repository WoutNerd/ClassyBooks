import { useEffect, useState } from 'react';
import '../../App.css'
import { Title, checkUser, getCookie, post } from '../../functions';
import TeacherNavbar from './teacherNavbar';

const TeacherChangeUser = () => {
  const [user, setUser] = useState([])

  useEffect(() => {
    const fetchData = async () => {
        const body = {sessionid: getCookie('sessionId'), userid:getCookie('changeUser')}
        let changeUser = await post('/getUser', body, 'change user')
        setUser(changeUser)}
    fetchData();
  }, [])

  Title('Bewerk gebruiker '+user.firstname + ' ' + user.lastname)
  checkUser(1)

    const handleSubmit = (event) =>{
      event.preventDefault()
    }

    const renderForm = (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input type="text" name="name" required placeholder="Voornaam" className="login" autoFocus />
            </div>
            <div className="input-container">
              <input type="text" className="login" name="surname" required placeholder="Achternaam" />
            </div>
            <div className="input-container">
              <input type="text" className="login" name="clss" required placeholder="Klas" />
            </div>
            <div className="input-container">
              <input type="text" className="login" name="clssNum" required placeholder="Klasnummer" />
            </div>
            <div className="input-container">
              <input type="text" className="login" name="readinglvl" required placeholder="Leesniveau" />
            </div>
            <div className="button-container">
              <input type="submit" value={"Login"} className="login-button" />
            </div>
          </form>
        </div>
      );


    return ( 
        <div>
            <nav><TeacherNavbar/></nav>
            <div className="content">
                <h2>Verander gegevens van {user.firstname} {user.lastname}</h2>
            {renderForm}
            </div>
        </div>
     );
}
 
export default TeacherChangeUser;