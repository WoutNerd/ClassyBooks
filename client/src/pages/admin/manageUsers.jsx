import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, Title, post, checkUser } from '../../functions';
import { useNavigate } from 'react-router'
import TeacherNavbar from '../teacher/teacherNavbar';

async function deleteUser(userId) {
  const sessionId = getCookie('sessionId')
  const body = { sessionId, userId }
  if (window.confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')) {
    post('/removeUser', body)
  } else { }
}


const sessionId = getCookie('sessionId')
const body = { sessionId }








const ManageUsers = () => {
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

  const [selectedUser, setSelectedUser] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [sort, setSort] = useState('name')
  const [sortDirection, setSortDirection] = useState('ascending')
  const [sortedClss, setSortedCllss] = useState([])
  const [sortedReadingLvl, setSortedReadingLvl] = useState([])
  const [filterdUsers, setFilterdUsers] = useState([])
  const [users, setUsers] = useState([])
  const [sortedPrivs, setSortedprivs] = useState([])
  const [filter, setFilter] = useState('none')

  let response
useEffect(() => {
  const body = {sessionId}
  const fetchData = async () => { 
    response = await post("/allUsers", body, 'manage users')
  const specifiedUsers = response
  setUsers(specifiedUsers)
  setFilterdUsers(specifiedUsers)

  
let readinglevels = []
specifiedUsers?.map(user => {
  if (!readinglevels.includes(user.readinglevel)) {
    readinglevels = [...readinglevels, user.readinglevel]
  }
})
readinglevels.sort()
const indexReadinglvl = readinglevels.indexOf(null);
if (indexReadinglvl > -1) { // only splice array when item is found
  readinglevels.splice(indexReadinglvl, 1); // 2nd parameter means remove one item only
}
setSortedReadingLvl(readinglevels)

let allClss = []
specifiedUsers?.map(user => {
  if (!allClss.includes(user.class)) {
    allClss = [...allClss, user.class]
  }
})
allClss.sort()

const indexClss = allClss.indexOf(null);
if (indexClss > -1) { // only splice array when item is found
  allClss.splice(indexClss, 1); // 2nd parameter means remove one item only
}
setSortedCllss(allClss)
let privs = []
specifiedUsers?.map(user => {
  if (!privs.includes(user.privilege)) {
    privs = [...privs, user.privilege]
  }
})
privs.sort()
setSortedprivs(privs)
} 
  fetchData()
  
},[])



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

  const handleChangeFilter = (event) => {
    const {
      selectedIndex,
      options
    } = event.currentTarget;
    const selectedOption = options[selectedIndex];
    const selectedFilter = selectedOption.value;
    const selectedFilterGroup = selectedOption.closest('optgroup')?.id;

    setFilter(selectedFilter)
    if (selectedFilterGroup === 'class') {
      const selectedFilterUsers = users.filter(user => user.class.includes(selectedFilter))
      setFilterdUsers(selectedFilterUsers)
    }
    if (selectedFilterGroup === 'readinglevel') {
      const selectedFilterUsers = users.filter(user => user.readinglevel.includes(selectedFilter))
      setFilterdUsers(selectedFilterUsers)

    }
    if (selectedFilterGroup === 'privilege') {

      const selectedFilterUsers = users.filter(user => user.privilege === selectedFilter)
      setFilterdUsers(selectedFilterUsers)

    }

    if (selectedFilter === 'none') setFilterdUsers(users)


  }

  return (<div>
    <nav><TeacherNavbar /></nav>
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
      <select name='filter' id='filter' value={filter} onChange={handleChangeFilter}>
        <option value="none">Geen filter</option>
        <optgroup label='Klas' id='class'>
          {sortedClss.map(clss => <option value={clss}>{clss}</option>)}
        </optgroup>
        <optgroup label='Niveau' id='readinglevel'>
          {sortedReadingLvl.map(readinglevel => <option value={readinglevel}>{readinglevel}</option>)}
        </optgroup>
        <optgroup label='Privilege' id='privilege'>
          {sortedPrivs.map(priv => <option value={priv}>{priv}</option>)}
        </optgroup>
      </select>
      <div className='itemList'>
        {showAll ?
          users.map((user) => (
            <li key={user.userid} onClick={() => { setSelectedUser(user); setShowAll(false); }} className='item'>
              <h3>{user.firstname + ' ' + user.lastname}</h3>
            </li>
          ))
          : <div>
            <h2>{selectedUser.firstname + ' ' + selectedUser.lastname}</h2>
            <button onClick={() => { handlePw(selectedUser.userid) }} className="button">Verander wachtwoord van {selectedUser.firstname + ' ' + selectedUser.lastname}</button>
            <button onClick={() => { deleteUser(selectedUser.userid) }} className="button">Verwijder {selectedUser.firstname + ' ' + selectedUser.lastname}</button>
            <button onClick={() => setShowAll(true)} className="button">Toon alle gebruikers</button>
          </div>
        }
      </div></div>
  </div>
  )
};

export default ManageUsers;