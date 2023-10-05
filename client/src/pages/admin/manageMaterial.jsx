import { useState, useEffect } from 'react';
import "../../App.css"
import TeacherNavbar from "../teacher/teacherNavbar"
import {checkUser, post, Title, getCookie} from '../../functions'

async function del(materialid) {
   const sessionId = getCookie('sessionId')
   const body = {sessionId, materialid}
   if(window.confirm('Weet u zeker dat u dit boek wilt verwijderen?')){
    await post('/removeMaterial', body)
   }
}


const ManageMaterials =  () => {
  Title('Beheer boeken')
  checkUser(2)
  
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
    <div><TeacherNavbar></TeacherNavbar></div>
      <div>
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
          <button onClick={()=> del(selectedBook.materialid)} className="button">Verwijder Boek</button>
          <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
        </div>
        }
      </div>
    </div>
  )
};

export default ManageMaterials;
