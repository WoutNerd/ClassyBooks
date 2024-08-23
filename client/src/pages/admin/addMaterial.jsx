import '../../App.css'
import { post, Title, getCookie, checkUser } from '../../functions'
import { useState } from 'react'
import TeacherNavbar from '../teacher/teacherNavbar'
import { useNavigate } from 'react-router-dom'

async function addMaterial(isChecked) {

    
    const sessionid = getCookie('sessionId')
    var [title, place, author, cover, pages, readinglevel, isbn] = document.forms[0]
    title = title.value
    place = place.value
    author = author.value
    cover = cover.value
    pages = pages.value
    readinglevel = readinglevel.value
    isbn = isbn.value
    const available = isChecked
    const description = {author, cover, pages, readinglevel}
    var body = {sessionid, title, place, description, available, isbn}

    if (title === "" || place === "" || author === "") {
        alert('Je moet de velden Titel, Locatie en Auteur invullen')
        
    }

    await post('/createMaterial', body)
}



const AddMaterial = () => {
    Title('Boeken toevoegen')
    checkUser(2)



    const navigate = useNavigate();

    const redirectToPage = (path) => {
      navigate(path); // Use navigate to go to the specified path
    };


    const [isChecked, setIsChecked] = useState(true);
    const [isbn, setIsbn] = useState()

    function handleIsbn(value) {
        const decoded = value.split('').map(e => {
            if(e === '&') {return '1'} else
            if(e === 'é') {return '2'} else
            if(e === '"') {return '3'} else
            if(e === "'") {return '4'} else
            if(e === '(') {return '5'} else
            if(e === '§') {return '6'} else
            if(e === 'è') {return '7'} else
            if(e === '!') {return '8'} else
            if(e === 'ç') {return '9'} else
            if(e === 'ç') {return '9'} else
            if(e === 'à') {return '0'}
            else return e
        }).join("")

        setIsbn(decoded)
        
    }

    function handleChange(e) {
        setIsChecked(e.target.checked);
      }
    
    return ( <div>
        <nav><TeacherNavbar/></nav>
        <form onSubmit={e => e.preventDefault}>
            <input type="text" name='title' placeholder='Titel' class='login'/>
            <br />
            <input type="text" name='place' placeholder='Locatie' class='login'/>
            <br />
            <input type="text" name='author' placeholder='Auteur' class='login'/>
            <br />
            <input type="url" name='cover' placeholder='Url van de cover' class='login'/>
            <br />
            <input type="number" name='pages' placeholder='Aantal paginas' class='login'/>
            <br />
            <input type="text" name='readinglevel' placeholder='Lees niveau' class='login'/>
            <br />
            <input type="text" name='isbn' placeholder='ISBN' class='login' value={isbn} onInput={(e) => handleIsbn(e.target.value)} onKeyDown={e => {if(e.key === 'Enter') e.preventDefault()}}/>
            <br />
            <input type="checkbox"  placeholder='Beschikbaar' checked={isChecked} onChange={handleChange}/>
            <label htmlFor="">Beschikbaar</label>
            <br />
            <button placeholder='Voeg toe' onClick={(e) => {e.preventDefault();addMaterial(isChecked)}} className='button'><p>Voeg toe</p></button>
        </form>
        <button onClick={() => redirectToPage(`../beheer/json-upload`)}>Importeren</button>
    </div> );
}
 
export default AddMaterial;