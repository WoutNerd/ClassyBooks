import { useState, useEffect } from 'react';
import "../../App.css"
import {checkUser, post, Title, getCookie} from '../../functions'

async function lend(materialid) {
  const userid = getCookie("userId")
  const body = {userid, materialid}
  const resp = await post("/lendMaterial", body)
  if(resp.statusText === 'OK'){
    alert('Succesvol uit geleend. Je moet het terugbrengen voor '+ resp.json)
  }
}

const StudentLib =  () => {
  Title('Bibliotheek')
  checkUser(0)
  
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
          <button onClick={() => lend(selectedBook.materialid)}>Leen uit</button>
          <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
        </div>
        }
      </div>
    </div> 
  )
};

export default StudentLib;
