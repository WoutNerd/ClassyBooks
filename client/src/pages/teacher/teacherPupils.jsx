import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, Title, post, checkUser } from '../../functions';
import TeacherNavbar from '../teacher/teacherNavbar';


const sessionId = getCookie('sessionId')
const body = { sessionId }



const Pupils = () => {

  checkUser(1);
  Title('Leerlingen')

  const [selectedUser, setSelectedUser] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [sort, setSort] = useState('name')
  const [sortDirection, setSortDirection] = useState('ascending')
  const [material, setMaterial] = useState({})
  const [filter, setFilter] = useState('none')
  const [sortedClss, setSortedCllss] = useState([])
  const [sortedReadingLvl, setSortedReadingLvl] = useState([])
  const [filterdUsers, setFilterdUsers] = useState([])
  const [users, setUsers] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      const response = await post("/allUsers", body, 'teacher pupils')
      const specifiedUsers = response.filter(function (user) { return user.privilege === 0 })
      setUsers(specifiedUsers)
      setFilterdUsers(specifiedUsers)

      let readinglevels = []
      specifiedUsers?.map(user => {
        if (!readinglevels.includes(user.readinglevel)) {
          readinglevels = [...readinglevels, user.readinglevel]
        }
      })
      readinglevels.sort()
      setSortedReadingLvl(readinglevels)

      let allClss = []
      specifiedUsers?.map(user => {
        if (!allClss.includes(user.class)) {
          allClss = [...allClss, user.class]
        }
      })
      allClss.sort()
      setSortedCllss(allClss)
    }
  fetchData()}, [])







  const HandleClick = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const sessionid = getCookie('sessionId')
          const body = { 'materialid': selectedUser.Users, sessionid }
          const resp = await post('/getMaterial', body)
          setMaterial(resp)
        } catch (error) {
          console.error(error)
        }
      };

      fetchData();
    }, []);
  }



  if (!users) {
    return <div>Loading...</div>;
  }

  const handleChangeSort = (event) => {
    const selectedSort = event.target.value;
    const selectedDirection = sortDirection;
    setSort(selectedSort)

    const sortedUsers = [...users].sort((a, b) => {
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

    users = sortedUsers; // Update the sorted data
  };



  const handleChangeDirection = (event) => {
    const selectedSort = sort; // Get the currently selected sort key
    const selectedDirection = event.target.value; // Get the newly selected sort direction

    setSortDirection(selectedDirection); // Update the sort direction

    const sortedUsers = [...users].sort((a, b) => {
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

    users = sortedUsers; // Update the sorted data
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
      </select>
      <div className='itemList'>
        {showAll ?
          filterdUsers.map((user) => (
            <li key={user.userid} onClick={() => { setSelectedUser(user); setShowAll(false); HandleClick() }} className='item'>
              <h3>{user.firstname + ' ' + user.lastname}</h3>
            </li>
          ))
          : <div>
            <h2>{selectedUser.firstname + ' ' + selectedUser.lastname}</h2>
            <p>{ }</p>
            <button onClick={() => setShowAll(true)} className="button">Toon alle gebruikers</button>
          </div>
        }
      </div></div>
  </div>
  )
};

export default Pupils;