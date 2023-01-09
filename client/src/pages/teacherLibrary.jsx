import "../App.css"
import TeacherNavbar from "./teacherNavbar";
import { useState } from "react";


const books = [
    {Title: "1 april",
    shelf: "5",
    checkoutUser: "",
    location: "Wolfklas",
    author: "Averbode"
    },
    {Title: "1-0 voor buurvrouw Krul",
    shelf: "6",
    checkoutUser: "",
    location: "Wolfklas",
    author: "Koos Meinderts"
    },
];



const TeacherLibrary = () => {
    const bookInfo = (
        <div>
            <h2>{books.Title}</h2>
        </div>
    );
    return ( 
        <div>
            <nav>
                <TeacherNavbar/>
            </nav>
            <div>
                <ul>
                    {books.map((item)=>{
                    return (
                    <li className="book">
                        <button onClickCapture={bookInfo}>{item.Title}</button>
                    </li>
                    )
                })}
                </ul>
            </div>
        </div>
     );
}
 
export default TeacherLibrary;