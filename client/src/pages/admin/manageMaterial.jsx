import { useState, useEffect } from 'react';
import "../../App.css"
import TeacherNavbar from "../teacher/teacherNavbar"
import { post, Title, getCookie } from '../../functions'
import { useNavigate } from 'react-router-dom';

async function del(materialid) {
  const sessionId = getCookie('sessionId')
  const body = { sessionId, materialid }
  if (window.confirm('Weet u zeker dat u dit boek wilt verwijderen?')) {
    await post('/removeMaterial', body)
    window.location.replace('/beheer/boeken-beheren')
  }

}




const ManageMaterials = () => {
  Title('Beheer boeken')


  const [books, setBooks] = useState(null);
  const [filterdBooks, setFilterdBooks] = useState(null)
  const [showAll, setShowAll] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sort, setSort] = useState('title')
  const [sortDirection, setSortDirection] = useState('ascending')
  const [filter, setFilter] = useState('none')
  const [locations, setLocations] = useState([])
  const [readinglevels, setReadinglevels] = useState([])
  const [lendTo, setLendTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New search state

  const navigate = useNavigate();


  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };



  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await post("/allMaterials");
        if (isMounted) {
          setBooks(response);
          setFilterdBooks(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    return () => { isMounted = false }; // Cleanup functie
  }, []);



  function change(id) {
    document.cookie = "changeMaterial = " + id
    redirectToPage(`bewerken`)

  }

  useEffect(() => {
    if (books) {
      setLocations([...new Set(books.map(book => book.place?.toLowerCase().trim()))]);
      setReadinglevels([...new Set(books.map(book => book.descr?.readinglevel?.toLowerCase().trim()))]);
    }
  }, [books]);


  if (!books) {
    return <div>Loading...</div>;
  }

  const handleChangeFilter = (event) => {
    const {
      selectedIndex,
      options
    } = event.currentTarget;
    const selectedOption = options[selectedIndex];
    const selectedFilter = selectedOption.value;
    const selectedFilterGroup = selectedOption.closest('optgroup')?.id;

    setFilter(selectedFilter)
    if (selectedFilterGroup === 'place') {
      const selectedFilterBooks = books.filter(book => book.place?.toLowerCase().includes(selectedFilter))
      setFilterdBooks(selectedFilterBooks)
    }
    if (selectedFilterGroup === 'readinglevel') {
      const selectedFilterBooks = books.filter(book => book.descr?.readinglevel?.toLowerCase().includes(selectedFilter))
      setFilterdBooks(selectedFilterBooks)

    }
    if (selectedFilterGroup === 'available') {
      const selectedFilterBooks = books.filter(book => book.available.includes(selectedFilter))
      setFilterdBooks(selectedFilterBooks)
    }

    if (selectedFilter === 'none') setFilterdBooks(books)

  }

  const handleChangeSort = (event) => {
    const selectedSort = event.target.value;
    const selectedDirection = sortDirection;

    setSort(selectedSort)

    const sortedMaterials = [...filterdBooks].sort((a, b) => {
      if (selectedDirection === 'ascending') {
        if (a[selectedSort] < b[selectedSort]) return -1;
        if (a[selectedSort] > b[selectedSort]) return 1;
        return 0;
      } else if (selectedDirection === 'descending') {
        if (a[selectedSort] > b[selectedSort]) return -1;
        if (a[selectedSort] < b[selectedSort]) return 1;
        return 0;
      } return null
    });

    setFilterdBooks(sortedMaterials); // Update the sorted data
  };



  const handleChangeDirection = (event) => {
    const selectedSort = sort; // Get the currently selected sort key
    const selectedDirection = event.target.value; // Get the newly selected sort direction

    setSortDirection(selectedDirection); // Update the sort direction
    // eslint-disable-next-line
    if (filterdBooks) {
      setFilterdBooks([...filterdBooks].sort((a, b) => {
        if (selectedDirection === 'ascending') return a[selectedSort] > b[selectedSort] ? 1 : -1;
        if (selectedDirection === 'descending') return a[selectedSort] < b[selectedSort] ? 1 : -1;
        return 0;
      }));
    }
  };



  const handleSelect = async (bookid) => {
    setShowAll(false);
    const sessionid = getCookie('sessionId');

    try {
      const bookResponse = await post('/getMaterial', { materialid: bookid, sessionid }, 'manageMaterial');
      const book = bookResponse[0];

      const userId = book?.lendoutto;
      const lenderResponse = userId ? await post('/getUser', { userid: userId, sessionid }, 'manageMaterial') : null;

      setSelectedBook(book);
      setLendTo(lenderResponse);

    } catch (error) {
      console.error(error);
    }
  };


  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase().split("").map(e => {
      if (e === '&') { return '1' } else
        if (e === 'é') { return '2' } else
          if (e === '"') { return '3' } else
            if (e === "'") { return '4' } else
              if (e === '(') { return '5' } else
                if (e === '§') { return '6' } else
                  if (e === 'è') { return '7' } else
                    if (e === '!') { return '8' } else
                      if (e === 'ç') { return '9' } else
                        if (e === 'ç') { return '9' } else
                          if (e === 'à') { return '0' }
                          else { return e }
    }).join("")

    setSearchQuery(query);

    const regex = new RegExp(query, 'i'); 

    const searchedBooks = books.filter(book =>
      regex.test(book?.title) ||  // Check if title exists
      regex.test(book?.descr?.author) ||  // Check if descr and author exist
      regex.test(book?.isbn)  // Check if ISBN exists
    );

    setFilterdBooks(searchedBooks); 
  };


  return (
    <div>
      <div><TeacherNavbar /></div>
      <div className='content'>
        <input
          id='search'
          type="text"
          placeholder="Zoek op titel, auteur, of ISBN..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        <select name="sort" id="sort" value={sort} onChange={handleChangeSort}>
          <option value="title">Titel</option>
          <option value="avgscore">Score</option>
          <option value="lendcount">Aantal keer uitgeleend</option>
          <option value="available">Beschikbaar</option>
          <option value="place">Locatie</option>
        </select>
        <select name="sortDirection" id="sortDirection" value={sortDirection} onChange={handleChangeDirection}>
          <option value="ascending">Oplopen</option>
          <option value="descending">Aflopend</option>
        </select>
        <select name='filter' id='filter' value={filter} onChange={handleChangeFilter}>
          <option value="none">Geen filter</option>
          <optgroup label='Beschikbaarheid' id='available'>
            <option value="1">Beschikbaar</option>
            <option value="0">Onbeschikbaar</option>
          </optgroup>
          <optgroup label='Locatie' id='place'>
            {locations.map(location => <option key={location} value={location}>{location}</option>)}
          </optgroup>
          <optgroup label='Niveau' id='readinglevel'>
            {readinglevels.map(readinglevel => <option key={readinglevel} value={readinglevel}>{readinglevel}</option>)}
          </optgroup>
        </select>

        {showAll ? (
          <div className='itemList'>
            {filterdBooks.map((book) => (
              <li key={book.materialid} className='bookItem' onClick={() => { handleSelect(book.materialid) }}>
                <img src={book.descr.cover} alt={book.descr.cover} className='cover' />
                <h3>{book.title}</h3>
              </li>
            ))}
          </div>
        ) : (
          selectedBook && (
            <div>
              <h2>{selectedBook.title}</h2>
              <h3>Auteur: {selectedBook.descr?.author?.trim()}</h3>
              <img src={selectedBook.descr.cover} alt="" />
              <p>Locatie: {selectedBook.place?.toLowerCase().trim()}</p>
              <p>Pagina's: {selectedBook.descr.pages}</p>
              <p>{lendTo ? `Is uitgeleend door: ` + lendTo.firstname + ' ' + lendTo.lastname : ''}</p>
              <button onClick={() => del(selectedBook.materialid)} className="button">Verwijder Boek</button>
              <button onClick={() => change(selectedBook.materialid)}>Verander boek</button>
              <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ManageMaterials;
