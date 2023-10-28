import React, { useState, useEffect } from 'react';
import "../../App.css";
import { checkUser, post, Title, getCookie } from '../../functions';
import { useNavigate } from 'react-router-dom';

async function lend(materialid) {
  const userid = getCookie("userId");
  const body = { userid, materialid };
  const resp = await post("/lendMaterial", body);
  if (resp.statusText === 'OK') {
    alert('Succesvol uitgeleend. Je moet het terugbrengen voor ' + resp.text);
  }
}

async function available(materialid) {
  const sessionid = getCookie('sessionId');
  const body = { sessionid, materialid };
  try {
    const resp = await post('/getMaterial', body);
    if (!resp) {
      return 'Laden...';
    } else if (resp && resp.available === '1') {
      return 'Beschikbaar';
    } else if (resp && resp.available === '0'){
      return 'Onbeschikbaar';
    } else {
      return 'Fout'
    }
  } catch (error) {
    console.error('Error in available function:', error);
    return 'Fout bij ophalen beschikbaarheid';
  }
}

const StudentLib = () => {
  Title('Bibliotheek');
  checkUser(0);
  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };

  const [books, setBooks] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [availability, setAvailability] = useState(''); 
  const [currentBook, setCurrentBook] = useState(null)
  const [currentBookSelected, setCurrentBookSelected] = useState(false)
  const [sort, setSort] = useState('title')
  const [sortDirection, setSortDirection] = useState('ascending')

  useEffect(()=>{
    const getCurrentBook = async () => {
        const sessionid = getCookie('sessionId')
        const userid = getCookie('userId')
        var body = {sessionid,userid}
        const resp = await post("/getUser", body)
        console.log(resp)
        if(resp.materials !== null){
        const materialid = resp.materials[0] 
        body = {sessionid, materialid}
        const book = await post('/getMaterial',body)
        setCurrentBook(book)
        setCurrentBookSelected(true)}
    }; getCurrentBook()
  },[])

  useEffect(()=>{
    const getBooks = async () => {
        console.log('getBooks')
        const book = await post('/allMaterials')
        console.log('books: '+book)
        setBooks(book)
    }; getBooks()
  },[])

  const handleClick = async (materialid) => {
    const sessionid = getCookie('sessionId');
    const body = { materialid, sessionid };
    try {
      const response = await post("/getMaterial", body)
      setSelectedBook(response);
      setShowAll(false); 
      const bookAvailability = await available(materialid); 
      setAvailability(bookAvailability);
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div>
              <select name="sort" id="sort" value={sort} onChange={handleChangeSort}>
          <option value="title">Titel</option>
          <option value="avgscore">Score</option>
          <option value="available">Beschikbaar</option>
          <option value="place">Locatie</option>
        </select>
        <select name="sortDirection" id="sortDirection" value={sortDirection} onChange={handleChangeDirection}>
          <option value="ascending">Oplopen</option>
          <option value="descending">Aflopend</option>
        </select>
      <div>{currentBookSelected ? (
        <div className="return">
          <button className='button' onClick={()=>{document.cookie='materialid='+currentBook.materialid;redirectToPage('/leerling/lever-in')}}>Dien {currentBook?.title} terug in</button>
        </div>):<div/>}
        {showAll ? (
          <div>
            {books &&
              books.map((book) => (
                <div key={book.materialid}>
                  <h3 onClick={() => handleClick(book.materialid)} className='item'>{book.title}</h3>
                </div>
              ))}
          </div>
        ) : (
          <div>
            <h2>{selectedBook?.title}</h2>
            <h3>Auteur: {selectedBook?.descr?.author}</h3>
            <img src={selectedBook?.descr?.cover} alt="" />
            <p>Locatie: {selectedBook?.place}</p>
            <p>Paginas: {selectedBook?.descr?.pages}</p>
            <p>{availability}</p> {/* Render the availability state */}
            {availability !== 'Onbeschikbaar' && ( // Conditionally render the button
              <button onClick={() => lend(selectedBook?.materialid)}>Leen uit</button>
            )}
            <button onClick={() => setShowAll(true)} className="button">
              Toon alle boeken
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLib;
