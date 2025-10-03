import { useState, useEffect } from 'react';
import '../../App.css';
import { getCookie, Title, post, Toast } from '../../functions';
import { useNavigate } from 'react-router';
import TeacherNavbar from '../teacher/teacherNavbar';
import Toolbar from '../../components/Toolbar';


const ManageUsers = () => {
  Title('Gebruikers beheren');

  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };

  function handlePw(userid) {
    document.cookie = 'changePwUser=' + userid;
    redirectToPage('/beheer/verander-gebruiker-wachtwoord');
  }

  const [selectedUser, setSelectedUser] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [sort, setSort] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [sortedClss, setSortedCllss] = useState([]);
  const [sortedReadingLvl, setSortedReadingLvl] = useState([]);
  const [filterdUsers, setFilterdUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortedPrivs, setSortedprivs] = useState([]);
  const [filter, setFilter] = useState('none');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(``)
  const [toastType, setToastType] = useState(``)

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


  function reloadPage() {
    setUsers(null)
    setFilterdUsers(null)
    setShowAll(true)
    setSelectedUser(null)

    const body = { sessionId: getCookie('sessionId') };

    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await post('/allUsers', body, 'manage users');
        if (isMounted) {
          setUsers(response);
          setFilterdUsers(response);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    return () => { isMounted = false };
  }


  async function deleteUser(userId) {
    const sessionId = getCookie('sessionId');
    const body = { sessionId, userId };
    if (window.confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')) {
      await post('/removeUser', body);
      reloadPage()

      setShowToast(true)
      setToastMessage(`Gebruiker succesvol verwijderd.`)
      setToastType(`succes`)
    }
  }

  useEffect(() => {
    const body = { sessionId: getCookie('sessionId') };
    const fetchData = async () => {
      const response = await post('/allUsers', body, 'manage users');
      const specifiedUsers = response;
      setUsers(specifiedUsers);
      setFilterdUsers(specifiedUsers);

      let readinglevels = [];
      specifiedUsers?.forEach(user => {
        if (!readinglevels.includes(user.readinglevel?.toLowerCase().trim())) {
          readinglevels = [...readinglevels, user.readinglevel?.toLowerCase().trim()];
        }
      });
      readinglevels.sort();
      const indexReadinglvl = readinglevels.indexOf(null);
      if (indexReadinglvl > -1) {
        readinglevels.splice(indexReadinglvl, 1);
      }
      setSortedReadingLvl(readinglevels);

      let allClss = [];
      specifiedUsers?.forEach(user => {
        if (!allClss.includes(user.class?.toLowerCase().trim())) {
          allClss = [...allClss, user.class?.toLowerCase().trim()];
        }
      });
      allClss.sort();
      const indexClss = allClss.indexOf(null);
      if (indexClss > -1) {
        allClss.splice(indexClss, 1);
      }
      setSortedCllss(allClss);

      let privs = [];
      specifiedUsers?.forEach(user => {
        if (!privs.includes(user.privilege)) {
          privs = [...privs, user.privilege];
        }
      });
      privs.sort();
      setSortedprivs(privs);
    };
    fetchData();
  }, []);

  if (!users) {
    return <div>Loading...</div>;
  }

  const handleChangeSort = (event) => {
    const selectedSort = event.target.value;
    const selectedDirection = sortDirection;
    setSort(selectedSort);
    // eslint-disable-next-line
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

    setFilterdUsers(sortedMaterials); // Update the sorted data
  };

  const handleChangeDirection = (event) => {
    const selectedSort = sort; // Get the currently selected sort key
    const selectedDirection = event.target.value; // Get the newly selected sort direction

    setSortDirection(selectedDirection); // Update the sort direction
    // eslint-disable-next-line
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

    setFilterdUsers(sortedMaterials); // Update the sorted data
  };

  const handleChangeFilter = (event) => {
    const {
      selectedIndex,
      options
    } = event.currentTarget;
    const selectedOption = options[selectedIndex];
    const selectedFilter = selectedOption.value;
    const selectedFilterGroup = selectedOption.closest('optgroup')?.id;

    setFilter(selectedFilter);

    let selectedFilterUsers = users;

    if (selectedFilterGroup === 'class') {
      selectedFilterUsers = users.filter(user => user.class?.toLowerCase().trim() === selectedFilter);
    }

    if (selectedFilterGroup === 'readinglevel') {
      selectedFilterUsers = users.filter(user => user.readinglevel?.toLowerCase().trim() === selectedFilter);
    }

    if (selectedFilterGroup === 'privilege') {
      selectedFilterUsers = users.filter(user => user.privilege === Number(selectedFilter));
    }

    if (selectedFilter === 'none') selectedFilterUsers = users;

    setFilterdUsers(selectedFilterUsers);
  };

  const handleSelect = async (user) => {
    const sessionid = getCookie(`sessionId`);
    const body = { sessionid, userid: user.userid };

    setSelectedUser(await post(`/getUser`, body, `selected user`));
    setShowAll(false);

    const historyPromises = user.history?.map(async e => {
      const material = await post(`/getMaterial`, { sessionid, materialid: e.material });
      return material[0].title;
    });
    const materialPromises = user.matrials?.map(async e => {
      const material = await post(`/getMaterial`, { sessionid, materialid: e.material });
      return material[0].title;
    });

    let history
    let material
    // Resolve all promises
    if (historyPromises !== undefined) history = await Promise.all(historyPromises);
    if (materialPromises !== undefined) material = await Promise.all(materialPromises);



    setSelectedHistory(history);
    setSelectedMaterials(material)
  };

    const handleChangeUser = () => {
    document.cookie = 'changeUser=' + selectedUser.userid + ';path=/'
    redirectToPage('bewerken')
  }


  return (
    <div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
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

        <div className=''>
          {showAll ?
            <div className="itemList">{
              filterdUsers.map((user) => (
                <li key={user.userid} onClick={() => { handleSelect(user) }} className='item'>
                  <h3>{user.firstname + ' ' + user.lastname}</h3>
                </li>
              ))}
            </div>
            : <div>
              <h2>{selectedUser.firstname + ' ' + selectedUser.lastname}</h2>
              <p>Klas: {selectedUser.class}</p>
              <p>Klas nummer: {selectedUser.classnum}</p>
              <h3>Geschiedenis:</h3>
              {selectedHistory ? <div className='history'>{selectedHistory?.map(book => <p>{book}</p>)}</div> : <p>Geen geschiedenis</p>}
              <h3>Boeken in bezit:</h3>
              {selectedMaterials ? <div className='materials'>{selectedMaterials?.map(book => <p>{book}</p>)}</div> : <p>Geen boeken in bezit</p>}
              <button onClick={() => { handlePw(selectedUser.userid) }} className="button">Verander wachtwoord van {selectedUser.firstname + ' ' + selectedUser.lastname}</button>
              <button onClick={() => { deleteUser(selectedUser.userid) }} className="button">Verwijder {selectedUser.firstname + ' ' + selectedUser.lastname}</button>
              <button className='button' onClick={() => handleChangeUser()}>Bewerk {selectedUser.firstname}</button>
              <button onClick={() => setShowAll(true)} className="button">Toon alle gebruikers</button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
