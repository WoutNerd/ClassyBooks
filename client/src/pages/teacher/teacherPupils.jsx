import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, Title, post } from '../../functions';
import TeacherNavbar from '../teacher/teacherNavbar';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../../components/Toolbar';

const Pupils = () => {
  const navigate = useNavigate();


  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };
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

    const [searchQuery, setSearchQuery] = useState(''); 

    const handleSearch = (event) => {
      const query = event.target.value.toLowerCase()

    setSearchQuery(query);

    const regex = new RegExp(query, 'i');

    const searchedUsers = users.filter(user =>
      regex.test(user?.firstname) ||  
      regex.test(user?.class) ||  
      regex.test(user?.lastname)  
    );

    setFilterdUsers(searchedUsers);
  };


  useEffect(() => {
    const fetchData = async () => {
      const sessionId = getCookie('sessionId')
      const body = { sessionId }
      const response = await post("/allUsers", body, 'teacher pupils')
      const specifiedUsers = response.filter(function (user) { return user.privilege === 0 })
      setUsers(specifiedUsers)
      setFilterdUsers(specifiedUsers)

      let readinglevels = []
      specifiedUsers?.map(user => {
        if (!readinglevels.includes(user.readinglevel?.toLowerCase().trim())) {
          readinglevels = [...readinglevels, user.readinglevel?.toLowerCase().trim()]
        }
      })
      readinglevels.sort()
      setSortedReadingLvl(readinglevels)

      let allClss = []
      specifiedUsers?.map(user => {
        if (!allClss.includes(user.class?.toLowerCase().trim())) {
          allClss = [...allClss, user.class?.toLowerCase().trim()]
        }
      })
      allClss.sort()
      setSortedCllss(allClss)
    }
    fetchData()
  }, [])







  const HandleClick = () => {

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
      const selectedFilterUsers = users.filter(user => user.class?.toLowerCase().trim().includes(selectedFilter))
      setFilterdUsers(selectedFilterUsers)
    }
    if (selectedFilterGroup === 'readinglevel') {
      const selectedFilterUsers = users.filter(user => user.readinglevel?.toLowerCase().trim().includes(selectedFilter))
      setFilterdUsers(selectedFilterUsers)

    }

    if (selectedFilter === 'none') setFilterdUsers(users)

  }

  const handleChangeUser = () => {
    document.cookie = 'changeUser=' + selectedUser.userid + ';path=/'
    redirectToPage('bewerken')
  }
  return (<div>
    <nav><TeacherNavbar /></nav>
    <div className='content'>
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchLabel='Naam of klas'
        sort={sort}
        sortDirection={sortDirection}
        filter={filter}
        onSortChange={handleChangeSort}
        onSortDirectionChange={handleChangeDirection}
        onFilterChange={handleChangeFilter}
        sortOptions={[
          { value: 'name', label: 'Naam' },
          { value: 'class', label: 'Klas' },
          { value: 'lastname', label: 'Achternaam' },
        ]}
        filterOptions={[
          {
            id: "privilege",
            label: "Gebruikerstype",
            options: [
              { value: "0", label: "Leerling" },
              { value: "1", label: "Leerkracht" },
              { value: "2", label: "Beheerders" },
            ],
          },
          {
            id: "class",
            label: "Klas",
            options: sortedClss.map(cls => ({ value: cls, label: cls })),
          },
          {
            id: "readinglevel",
            label: "Niveau",
            options: sortedReadingLvl.map(level => ({ value: level, label: level })),
          },
        ]}
      />
      <div className='itemList'>
        {showAll ?
          filterdUsers.map((user) => (
            <li key={user.userid} onClick={() => { setSelectedUser(user); setShowAll(false); HandleClick() }} className='item'>
              <h3>{user.firstname + ' ' + user.lastname}</h3>
            </li>
          ))
          : <div>
            <h2>{selectedUser.firstname + ' ' + selectedUser.lastname}</h2>
            <button className='button' onClick={() => handleChangeUser()}>Bewerk {selectedUser.firstname}</button>
            <button onClick={() => setShowAll(true)} className="button">Toon alle gebruikers</button>
          </div>
        }
      </div></div>
  </div>
  )
};

export default Pupils;