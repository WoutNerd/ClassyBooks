import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, Title, post, checkUser } from '../../functions';
import {useNavigate} from 'react-router'

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
        <div>
            {showAll ? 
        users.map((user) => (
          <div key={user.userid}>
            <h3 onClick={() => { setSelectedUser(user); setShowAll(false); }}>{user.firstname +' '+ user.lastname}</h3>
          </div>
        ))
        : <div>
            <h2>{selectedUser.firstname+' '+selectedUser.lastname}</h2>
            <button onClick={() => {handlePw(selectedUser.userid)}}>Verander wachtwoord van {selectedUser.firstname+' '+selectedUser.lastname}</button>
            <button onClick={() => {deleteUser(selectedUser.userid)}}>Verwijder {selectedUser.firstname+' '+selectedUser.lastname}</button>
            <button onClick={() => setShowAll(true)} className="button">Toon alle gebruikers</button>
          </div>
          }
        </div>
      </div> 
    )
  };
  
  export default ManageUsers;