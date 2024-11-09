import { useEffect, useState } from 'react';
import '../../App.css'
import { Title, Toast, checkUser, getCookie, post } from '../../functions';
import TeacherNavbar from '../teacher/teacherNavbar';
import { useNavigate } from 'react-router-dom';

const ChangeMaterial = () => {
  const [material, setMaterial] = useState([])
  const [isChecked, setIsChecked] = useState(0)
  const [isbn, setIsbn] = useState()

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(``)
  const [toastType, setToastType] = useState(``)

  const navigate = useNavigate();


  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };

  useEffect(() => {
    const fetchData = async () => {
      const body = { sessionid: getCookie('sessionId'), materialid: getCookie('changeMaterial') }
      let changeMaterial = await post('/getMaterial', body, 'change material')
      setMaterial(changeMaterial[0])
    }
    fetchData();
  }, [])

  Title('Bewerk Boek ' + material.title)
  checkUser(2)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const sessionid = getCookie('sessionId')
    const materialid = material.materialid


    let [title, place, author, cover, pages, readinglevel, isbn] = document.forms[0]

    const available = isChecked

    if (title?.value == ``) { title = material.title } else title = title.value; console.log(title == ``)
    if (place?.value == ``) place = material.place; else place = place.value
    if (author.value == null) author = material.description.author; else author = author.value
    if (cover?.value == null) cover = material.description.cover; else cover = cover.value
    if (readinglevel?.value == null) readinglevel = material.description.readinglevel; else readinglevel = readinglevel.value
    if (pages?.value == null) pages = material.description.pages; else pages = pages.value
    if (isbn?.value == ``) isbn = material.isbn; else isbn = isbn.value
    const description = { author, cover, pages, readinglevel }


    let availableBit = 0;
    if (available) {
      availableBit = 1;
    }

    const keys = [`title`, `place`, `descr`, `isbn`, `available`]
    const values = [title, place, description, isbn, availableBit]

    const body = { sessionid, materialid, keys, values }
    post('/changeMaterial', body, 'changeMaterial').then((resp) => resp.text().then((resp) => {
      if (resp == 'Statement executed correctly') {
        setShowToast(true)
        setToastMessage(`Boek succesvol aangepast.`)
        setToastType(`succes`)
      }
      else {
        setShowToast(true)
        setToastMessage(`De boek is niet succesvol aangepast. Probeer later opnieuw.`)
        setToastType(`error`)
      }
      
    }))

  }

  function handleIsbn(value) {
    const decoded = value.split('').map(e => {
      if (e === '&') { return '1' } else
        if (e === 'é') { return '2' } else
          if (e === '"') { return '3' } else
            if (e === "'") { return '4' } else
              if (e === '(') { return '5' } else
                if (e === '§') { return '6' } else
                  if (e === 'è') { return '7' } else
                    if (e === '!') { return '8' } else
                      if (e === 'ç') { return '9' } else
                        if (e === 'ç') { return '9' } else
                          if (e === 'à') { return '0' }
                          else return e
    }).join("")

    setIsbn(decoded)

  }

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <input type="text" name='title' placeholder='Titel' className='login' />
        <br />
        <input type="text" name='place' placeholder='Locatie' className='login' />
        <br />
        <input type="text" name='author' placeholder='Auteur' className='login' />
        <br />
        <input type="url" name='cover' placeholder='Url van de cover' className='login' />
        <br />
        <input type="number" name='pages' placeholder='Aantal paginas' className='login' />
        <br />
        <input type="text" name='readinglevel' placeholder='Lees niveau' className='login' />
        <br />
        <input type="text" name='isbn' placeholder='ISBN' className='login' value={isbn} onInput={(e) => handleIsbn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} />
        <br />
        <input type="checkbox" placeholder='Beschikbaar' checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
        <label htmlFor="">Beschikbaar</label>
        <br />
        <br />
        <button type="submit" className='login-button'>Pas aan</button>
      </form>
    </div>
  );


  return (
    <div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      <nav><TeacherNavbar /></nav>
      <div className="content">
        <h2>Verander gegevens van {material.title}</h2>
        {renderForm}
      </div>
    </div>
  );
}

export default ChangeMaterial;