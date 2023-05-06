import { useState, useEffect } from 'react';
import "../../App.css"
import {checkUser, post, Title} from '../../functions'


const StudentLib =  () => {
  Title('Bibliotheek')
  checkUser(1)
  
  const [books, setBooks] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);


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

  return (<div>
      <div>
          {showAll ? 
      books.map((book) => (
        <div key={book.title}>
          <h3 onClick={() => { setSelectedBook(book); setShowAll(false); }}>{book.title}</h3>
        </div>
      ))
      : <div>
          <h2>{selectedBook.title}</h2>
          <h3>Auteur: {selectedBook.descr.author}</h3>
          <img src={selectedBook.descr.cover} alt="" />
          <p>Locatie: {selectedBook.place}</p>
          <p>Paginas: {selectedBook.descr.pages}</p>
          <p>{selectedBook.lendoutto ? `Niet beschikbaar` : 'Beschikbaar'}</p>
          <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
        </div>
        }
      </div>
    </div> 
  )
};

export default StudentLib;
