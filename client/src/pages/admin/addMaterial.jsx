import '../../App.css'
import { post, Title, getCookie, checkUser } from '../../functions'
import { useState } from 'react'
import TeacherNavbar from '../teacher/teacherNavbar'

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

    const [isChecked, setIsChecked] = useState(false);

    function handleChange(e) {
        setIsChecked(e.target.checked);
      }
    
    return ( <div>
        <nav><TeacherNavbar/></nav>
        <form >
            <input type="text" name='title' placeholder='Titel' />
            <br />
            <input type="text" name='place' placeholder='Locatie' />
            <br />
            <input type="text" name='author' placeholder='Auteur' />
            <br />
            <input type="url" name='cover' placeholder='Url van de cover' />
            <br />
            <input type="number" name='pages' placeholder='Aantal paginas'/>
            <br />
            <input type="text" name='readinglevel' placeholder='Lees niveau'/>
            <br />
            <input type="checkbox"  placeholder='Beschikbaar' checked={isChecked} onChange={handleChange}/>
            <label htmlFor="">Beschikbaar</label>
            <br />
            <button placeholder='Voeg toe' onClick={() => addMaterial(isChecked)} ><p>Voeg toe</p></button>
        </form>
    </div> );
}
 
export default AddMaterial;