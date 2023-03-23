import React, { useState } from 'react';
import "../../App.css"
import TeacherNavbar from "./teacherNavbar"
import {checkUser, post, Title} from '../../functions'


const BookList = () => {
  Title('Bibliotheek')
  
  checkUser()
  const [lendOut, setLendOut] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [books, setBooks] = useState([
    { title: 'Book 1', author: 'Author 1', location: 'Wolfklas', shelf: '1', checkedOutUser: 'Jan' },
    { title: 'Book 2', author: 'Author 2', location: 'Wolfklas', shelf: '2', checkedOutUser: '' },
    { title: 'Book 3', author: 'Author 3', location: 'Wolfklas', shelf: '3', checkedOutUser: '' },
  ]);
  
  const [selectedBook, setSelectedBook] = useState(null);
  

  return (
    <div>
      <div>
        <TeacherNavbar/>
      </div>
      {showAll ? 
        books.map((book) => (
          <div key={book.title}>
            <h3 onClick={() => { setSelectedBook(book); setShowAll(false); }}>{book.title}</h3>
          </div>
        ))
        : <div>
            <h2>{selectedBook.title}</h2>
            <h3>{selectedBook.author}</h3>
            <p>Het boek staat in de {selectedBook.location}</p>
            <p>Het staat in rek {selectedBook.shelf}</p>
            <p>{selectedBook.checkedOutUser ? `Is uitgeleend door: ${selectedBook.checkedOutUser}` : ''}</p>
            <button onClick={() => setShowAll(true)} className="button">Toon alle boeken</button>
          </div>
          }
    </div>
  );
};

export default BookList;
