import { useState, useEffect } from 'react';
import "../../App.css"
import TeacherNavbar from "./teacherNavbar"
import {checkUser, post, Title} from '../../functions'


const TeacherLib =  () => {
  Title('Bibliotheek')
  checkUser(1)
  
  const [books, setBooks] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sort, setSort] = useState('title')
  const [sortDirection, setSortDirection] = useState('ascending')


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post("/allMaterials")
        setBooks(response);
      } catch (error) {
        console.error(error)
      }
    };

    fetchData();
  }, []);


  if (!books) {
    return <div>Loading...</div>;
  }

  const handleChangeSort = (event) => {
    const selectedSort = event.target.value; 
    const selectedDirection = sortDirection; 
  
    setSort(selectedSort)
  
    const sortedMaterials = [...books].sort((a, b) => {
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
  
    setBooks(sortedMaterials); // Update the sorted data
  };
  
  
  
  const handleChangeDirection = (event) => {
    const selectedSort = sort; // Get the currently selected sort key
    const selectedDirection = event.target.value; // Get the newly selected sort direction
  
    setSortDirection(selectedDirection); // Update the sort direction
  
    const sortedMaterials = [...books].sort((a, b) => {
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
  
    setBooks(sortedMaterials); // Update the sorted data
  };
  

  return (<div className='page'>
    <div className='lNav'><TeacherNavbar></TeacherNavbar></div>
      <div className='content'>
      <select name="sort" id="sort" value={sort} onChange={handleChangeSort}>
          <option value="title" selected>Titel</option>
          <option value="avgscore">Score</option>
          <option value="lendcount">Aantal keer uitgeleend</option>
          <option value="available">Beschikbaar</option>
          <option value="place">Locatie</option>
        </select>
        <select name="sortDirection" id="sortDirection" value={sortDirection} onChange={handleChangeDirection}>
          <option value="ascending" selected>Oplopen</option>
          <option value="descending">Aflopend</option>
        </select>
          {showAll ? 
      books.map((book) => (
        <div key={book.title}>
          <h3 onClick={() => { setSelectedBook(book); setShowAll(false); }} className='item'>{book.title}</h3>
        </div>
      ))
      : <div>
          <h2>{selectedBook.title}</h2>
          <h3>Auteur: {selectedBook.descr.author}</h3>
          <img src={selectedBook.descr.cover} alt="" />
          <p>Locatie: {selectedBook.place}</p>
          <p>Paginas: {selectedBook.descr.pages}</p>
          <p>{selectedBook.lendoutto ? `Is uitgeleend door: ${selectedBook.lendoutto}` : ''}</p>
          <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
        </div>
        }
      </div>
    </div>
  )
};

export default TeacherLib;
