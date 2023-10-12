import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, Title, post, checkUser } from '../../functions';
import {useNavigate} from 'react-router'
import TeacherNavbar from '../teacher/teacherNavbar';

async function deleteUser(userId) {
    const sessionId = getCookie('sessionId')
    const body = {sessionId, userId}
    if(window.confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')){
        post('/removeUser', body)
    }else{}
}



const ManageUsers =  () => {
    Title('Gebruikers beheren')
    checkUser(2)

    const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };

  function handlePw(userid) {
    document.cookie = 'changePwUser=' + userid
    redirectToPage('/beheer/verander-gebruiker-wachtwoord')
  }
    
    const [users, setUsers] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showAll, setShowAll] = useState(true)
  
    useEffect(() => {
      const fetchData = async () => {
        const sessionId = getCookie('sessionId')
        try {
        const body = {sessionId}
        const response = await post("/allUsers", body)
        setUsers(response);
        } catch (error) {
          console.error(error)
        }
      };
  
      fetchData();
    }, []);

    
  
  
    if (!users) {
      return <div>Loading...</div>;
    }
  
    return (<div>
      <nav><TeacherNavbar/></nav>
        <div className='itemList'>
            {showAll ? 
        users.map((user) => (
          <li key={user.userid}  onClick={() => { setSelectedUser(user); setShowAll(false); }} className='item'>
            <h3>{user.firstname +' '+ user.lastname}</h3>
          </li>
        ))
        : <div>
            <h2>{selectedUser.firstname+' '+selectedUser.lastname}</h2>
            <button onClick={() => {handlePw(selectedUser.userid)}} className="button">Verander wachtwoord van {selectedUser.firstname+' '+selectedUser.lastname}</button>
            <button onClick={() => {deleteUser(selectedUser.userid)}} className="button">Verwijder {selectedUser.firstname+' '+selectedUser.lastname}</button>
            <button onClick={() => setShowAll(true)} className="button">Toon alle gebruikers</button>
          </div>
          }
        </div>
      </div> 
    )
  };
  
  export default ManageUsers;