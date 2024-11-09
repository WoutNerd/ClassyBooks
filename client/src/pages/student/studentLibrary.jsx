import { useState, useEffect } from 'react';
import "../../App.css"
import { checkUser, getCookie, post, Title, Toast } from '../../functions';




const StudentLib = () => {
  Title('Bibliotheek');
  checkUser(0);

  // vars
  const [books, setBooks] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sort, setSort] = useState('title');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [filter, setFilter] = useState('none');
  const [locations, setLocations] = useState([]);
  const [readingLevels, setReadingLevels] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New search state

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(``)
  const [toastType, setToastType] = useState(``)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post("/allMaterials");
        setBooks(response);
        setFilteredBooks(response);
        const sessionid = getCookie('sessionId');
        const userid = getCookie('userId');
        const user = await post('/getUser', { sessionid, userid });
        const materialid = user.materials[0];
        const currentMaterial = await post('/getMaterial', { sessionid, materialid });
        setCurrentBook(currentMaterial);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Make sure to initialize 'locations' and 'readingLevels' with all available options from books
  books?.forEach(book => {
    if (book.place && !locations.includes(book.place)) {
      setLocations([...locations, book.place]);
    }
    if (book.descr?.readinglevel && !readingLevels.includes(book.descr.readinglevel)) {
      setReadingLevels([...readingLevels, book.descr.readinglevel]);
    }
  });

  if (!books) {
    return <div>Loading...</div>;
  }



  async function lend(materialid) {
    const userid = getCookie('userId');
    const body = { materialid, userid };
    const resp = await post('/lendMaterial', body);
  
  
    if (resp.status === 200) {
      let timeText
      resp.text().then((t) => {
        let time = new Date(t);
        timeText = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
      })
      setShowToast(true)
      setToastMessage(`Je hebt tot ${timeText} om het boek terug te brengen.`)
      setToastType(`succes`)
  
    } else {
      setShowToast(true)
      setToastMessage(`Uitlenen mislukt. Probeer opnieuw.`)
      setToastType(`error`)
    }
    
  }



  const handleChangeFilter = (event) => {
    const { selectedIndex, options } = event.currentTarget;
    const selectedOption = options[selectedIndex];
    const selectedFilter = selectedOption.value;
    const selectedFilterGroup = selectedOption.closest('optgroup')?.id;

    setFilter(selectedFilter);

    let selectedFilterBooks = books;

    if (selectedFilterGroup === 'place') {
      selectedFilterBooks = books.filter(book => book.place?.includes(selectedFilter));
    } else if (selectedFilterGroup === 'readinglevel') {
      selectedFilterBooks = books.filter(book => book.descr?.readinglevel?.includes(selectedFilter));
    } else if (selectedFilterGroup === 'available') {
      selectedFilterBooks = books.filter(book => book.available?.includes(selectedFilter));
    }

    if (selectedFilter === 'none') selectedFilterBooks = books;

    setFilteredBooks(selectedFilterBooks);
  };

  const handleChangeSort = (event) => {
    const selectedSort = event.target.value;
    const selectedDirection = sortDirection;

    setSort(selectedSort);

    const sortedMaterials = [...filteredBooks].sort((a, b) => {
      const aValue = a[selectedSort] || '';
      const bValue = b[selectedSort] || '';

      if (selectedDirection === 'ascending') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else if (selectedDirection === 'descending') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
      return 0;
    });

    setFilteredBooks(sortedMaterials); // Update the sorted data
  };

  const handleChangeDirection = (event) => {
    const selectedSort = sort; // Get the currently selected sort key
    const selectedDirection = event.target.value; // Get the newly selected sort direction

    setSortDirection(selectedDirection); // Update the sort direction

    const sortedMaterials = [...filteredBooks].sort((a, b) => {
      const aValue = a[selectedSort] || '';
      const bValue = b[selectedSort] || '';

      if (selectedDirection === 'ascending') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else if (selectedDirection === 'descending') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
      return 0;
    });

    setFilteredBooks(sortedMaterials);
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
                          else { console.log(e); return e }
    }).join("")

    setSearchQuery(query);


    console.log(books)
    const searchedBooks = books.filter(book =>


      (book.title?.includes(query)) ||  // Check if title exists
      (book.descr?.author?.includes(query)) ||  // Check if descr and author exist
      (book.ISBN?.includes(query))  // Check if ISBN exists
    );

    setFilteredBooks(searchedBooks);
  };



  return (<div>
    {showToast && (
      <Toast
        message={toastMessage}
        type={toastType}
        duration={3000}
        onClose={() => setShowToast(false)}
      />
    )}
    <center><div>
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
            {readingLevels.map(readinglevel => <option key={readinglevel} value={readinglevel}>{readinglevel}</option>)}
          </optgroup>
        </select>

        {currentBook ? <div><button onClick={() => window.location.replace('lever-in')} className="button big2">Dien {currentBook.title} in</button></div> : <></>}

        {showAll ? <div className='itemList'> {filteredBooks.map((book) => (
          <li key={book.materialid} className='bookItem' onClick={() => { setSelectedBook(book); setShowAll(false) }}>
            <img src={book.descr?.cover} alt="" className='cover' />
            <h3>{book.title}</h3>
          </li>
        ))}

        </div>

          : <div>
            <h2>{selectedBook.title}</h2>
            <h3>Auteur: {selectedBook.descr?.author}</h3>
            <img src={selectedBook.descr?.cover} alt="" />
            <p>Locatie: {selectedBook.place}</p>
            <p>Paginas: {selectedBook.descr?.pages}</p>
            <p>{selectedBook.lendoutto ? `Is uitgeleend door: ${selectedBook.lendoutto}` : ''}</p>
            <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
            <button onClick={() => lend(selectedBook.materialid)} className="button">Leen uit</button>
          </div>
        }
      </div>

    </div>
    </center>
  </div>
  );
};

export default StudentLib;
