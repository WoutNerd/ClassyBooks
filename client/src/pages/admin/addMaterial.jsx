import '../../App.css'
import { post, Title, getCookie, checkUser } from '../../functions'
import { useState } from 'react'
import TeacherNavbar from '../teacher/teacherNavbar'
import { useNavigate } from 'react-router-dom'

async function addMaterial(isChecked) {
    
    const sessionid = getCookie('sessionId')
    var [title, place, author, cover, pages, readinglevel] = document.forms[0]
    title = title.value
    place = place.value
    author = author.value
    cover = cover.value
    pages = pages.value
    readinglevel = readinglevel.value
    const available = isChecked
    const description = {author, cover, pages, readinglevel}
    var body = {sessionid, title, place, description, available}

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


    const [isChecked, setIsChecked] = useState(false);

    function handleChange(e) {
        setIsChecked(e.target.checked);
      }
    
    return ( <div>
        <nav><TeacherNavbar/></nav>
        <form >
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
            <input type="checkbox"  placeholder='Beschikbaar' checked={isChecked} onChange={handleChange}/>
            <label htmlFor="">Beschikbaar</label>
            <br />
            <button placeholder='Voeg toe' onClick={() => addMaterial(isChecked)} className='button'><p>Voeg toe</p></button>
        </form>
        <button onClick={() => redirectToPage(`../beheer/json-upload`)}>Importeren</button>
    </div> );
}
 
export default AddMaterial;