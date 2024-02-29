  import { useState, useEffect } from 'react';
  import "../../App.css"
  import TeacherNavbar from "../teacher/teacherNavbar"
  import { checkUser, post, Title, getCookie } from '../../functions'

  async function del(materialid) {
    const sessionId = getCookie('sessionId')
    const body = { sessionId, materialid }
    if (window.confirm('Weet u zeker dat u dit boek wilt verwijderen?')) {
      await post('/removeMaterial', body)
    }
  }


  const ManageMaterials = () => {
    Title('Beheer boeken')
    checkUser(2)

    const [books, setBooks] = useState(null);
    const [filterdBooks, setFilterdBooks] = useState(null)
    const [showAll, setShowAll] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [sort, setSort] = useState('title')
    const [sortDirection, setSortDirection] = useState('ascending')
    const [filter, setFilter] = useState('none')
    const [locations, setLocations] = useState([])
    const [readinglevels, setReadinglevels] = useState([])


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await post("/allMaterials")
          setBooks(response);
          setFilterdBooks(response)
          
        } catch (error) {
          console.error(error)
        }
      };

      fetchData();
    }, []);


    books?.map(book => {
      if(!locations.includes(book.place)){
        setLocations([...locations, book.place])
      }
    })

    books?.map(book => {
      if(!readinglevels.includes(book.descr.readinglevel)){
        setReadinglevels([...readinglevels, book.descr.readinglevel])
      }
    })

    console.log(readinglevels)
    console.log(locations)

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
      if(selectedFilterGroup === 'place'){
        const selectedFilterBooks = books.filter(book => book.place.includes(selectedFilter))
        setFilterdBooks(selectedFilterBooks)
      }
      if(selectedFilterGroup === 'readinglevel'){
        const selectedFilterBooks =  books.filter(book => book.descr.readinglevel.includes(selectedFilter))
        setFilterdBooks(selectedFilterBooks)
        
      }
      if(selectedFilterGroup === 'available'){
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
    
      const sortedMaterials = [...filterdBooks].sort((a, b) => {
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
    
      setFilterdBooks(sortedMaterials);
      
    };
    



   

    return (<div>
      <div><TeacherNavbar></TeacherNavbar></div>
      <div className='content'> 
        <select name="sort" id="sort" value={sort} onChange={handleChangeSort}>
          <option value="title" >Titel</option>
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
            {locations.map(location => <option value={location}>{location}</option>)}
          </optgroup>
          <optgroup label='Niveau' id='readinglevel'>
          {readinglevels.map(readinglevel => <option value={readinglevel}>{readinglevel}</option>)}
          </optgroup>
        </select>

        {showAll ? <div className='itemList'> { filterdBooks.map((book) => (
        <li className='bookItem'>
          <img src={book.descr.cover} alt="" className='cover'/>
          <h3 onClick={() => { setSelectedBook(book); setShowAll(false); }} >{book.title}</h3>
        </li>
      ))}
          
        </div>

          : <div>
            <h2>{selectedBook.title}</h2>
            <h3>Auteur: {selectedBook.descr.author}</h3>
            <img src={selectedBook.descr.cover} alt="" />
            <p>Locatie: {selectedBook.place}</p>
            <p>Paginas: {selectedBook.descr.pages}</p>
            <p>{selectedBook.lendoutto ? `Is uitgeleend door: ${selectedBook.lendoutto}` : ''}</p>
            <button onClick={() => del(selectedBook.materialid)} className="button">Verwijder Boek</button>
            <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
          </div>
        }
      </div>
    </div>
    )
  };

  export default ManageMaterials;
