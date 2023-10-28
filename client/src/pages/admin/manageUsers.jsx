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
    const [sort, setSort] = useState('name')
    const [sortDirection, setSortDirection] = useState('ascending')
  
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

    const handleChangeSort = (event) => {
      const selectedSort = event.target.value; 
      const selectedDirection = sortDirection; 
      setSort(selectedSort)
    
      const sortedMaterials = [...users].sort((a, b) => {
        if (selectedDirection === 'ascending') {
          if (a[selectedSort] < b[selectedSort]) return -1;
          if (a[selectedSort] > b[selectedSort]) return 1;
          return 0;
        } else if (selectedDirection === 'descending') {
          if (a[selectedSort] > b[selectedSort]) return -1;
          if (a[selectedSort] < b[selectedSort]) return 1;
          return 0;
        }
      });
      console.log(users)
    
      setUsers(sortedMaterials); // Update the sorted data
    };
    
    
    
    const handleChangeDirection = (event) => {
      const selectedSort = sort; // Get the currently selected sort key
      const selectedDirection = event.target.value; // Get the newly selected sort direction
    
      setSortDirection(selectedDirection); // Update the sort direction
    
      const sortedMaterials = [...users].sort((a, b) => {
        if (selectedDirection === 'ascending') {
          if (a[selectedSort] < b[selectedSort]) return -1;
          if (a[selectedSort] > b[selectedSort]) return 1;
          return 0;
        } else if (selectedDirection === 'descending') {
          if (a[selectedSort] > b[selectedSort]) return -1;
          if (a[selectedSort] < b[selectedSort]) return 1;
          return 0;
        }
      });
    
      setUsers(sortedMaterials); // Update the sorted data
    };
    
  
    return (<div>
      <nav><TeacherNavbar/></nav>
      <div className='content'>
      <select name="sort" id="sort" value={sort} onChange={handleChangeSort}>
          <option value="firstname">Voornaam</option>
          <option value="lastname">Achternaam</option>
          <option value="class">Klas</option>
          <option value="privilege">Gebruikerstype</option>
        </select>
        <select name="sortDirection" id="sortDirection" value={sortDirection} onChange={handleChangeDirection}>
          <option value="ascending">Oplopen</option>
          <option value="descending">Aflopend</option>
        </select>
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
        </div></div>
      </div> 
    )
  };
  
  export default ManageUsers;