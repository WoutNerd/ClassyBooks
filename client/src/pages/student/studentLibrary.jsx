import React, { useState, useEffect } from 'react';
import "../../App.css";
import { checkUser, post, Title, getCookie } from '../../functions';

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

  const [books, setBooks] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [availability, setAvailability] = useState(''); // Added state for availability

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post("/allMaterials");
        setBooks(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleClick = async (materialid) => {
    const sessionid = getCookie('sessionId');
    const body = { materialid, sessionid };
    try {
      const response = await post("/getMaterial", body);
      setSelectedBook(response);
      setShowAll(false); // Show the selected book details
      // Fetch and set the availability when a book is selected
      const bookAvailability = await available(materialid); // Pass materialid explicitly
      setAvailability(bookAvailability);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        {showAll ? (
          <div>
            {books &&
              books.map((book) => (
                <div key={book.materialid}>
                  <h3 onClick={() => handleClick(book.materialid)}>{book.title}</h3>
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
