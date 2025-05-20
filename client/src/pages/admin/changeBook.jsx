import { useEffect, useState } from 'react';
import '../../App.css'
import { Title, Toast, getCookie, post } from '../../functions';
import TeacherNavbar from '../teacher/teacherNavbar';


const ChangeMaterial = () => {
  const [material, setMaterial] = useState([])
  const [isChecked, setIsChecked] = useState(0)
  const [isbn, setIsbn] = useState()

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(``)
  const [toastType, setToastType] = useState(``)


  useEffect(() => {
    const fetchData = async () => {
      const body = { sessionid: getCookie('sessionId'), materialid: getCookie('changeMaterial') }
      let changeMaterial = await post('/getMaterial', body, 'change material')
      setMaterial(await changeMaterial[0])
      setIsChecked(changeMaterial[0].available)
    }
    fetchData();
  }, [])

  if (!material) {
    return <div>Loading...</div>;
  }

  Title('Bewerk Boek ' + material.title)
  


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

  async function handleChange(key, value) {
    console.log(key, value)
    let keys = [key]
    let values = [value]

    let temp = material
    console.log(temp)

    let descr = { author:temp.descr.author , cover:temp.descr.cover, pages:temp.descr.pages, readinglevel:temp.descr.readinglevel }
    console.log('descr before edit:')
    console.log(descr)
    if(key === 'available') {
      if(value) {
        values = [1]
      }
    }

    setMaterial(temp)

    if (key === 'author' || key === 'cover' || key === 'pages' || key === 'readinglevel') {
      descr[key] = value
      values = [descr]
      keys = ['descr']
      temp.descr = descr
    }else temp[key] = value
    console.log('decr after edit:')
    console.log(descr)
    const body = { sessionid: getCookie('sessionId'), materialid: getCookie('changeMaterial'), keys, values }
    post('/changeMaterial', body, 'changeMaterial').then((resp) => resp.text().then((resp) => {
      if (resp === 'Statement executed correctly') {
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
      <nav><TeacherNavbar /></nav>{
        !material ? <div>Loading...</div> :
      <div className="content">
        <h2>Verander gegevens van {material.title}</h2>
        <h2>Druk op enter om op te slaan</h2>
        <form>
        <input type="text" name='title' placeholder='Titel' className='login' defaultValue={material?.title || ''} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('title', e.target.value)} }}/>
        <br />
        <input type="text" name='place' placeholder='Locatie' className='login' defaultValue={material?.place || ''} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('place', e.target.value)} }}/>
        <br />
        <input type="text" name='author' placeholder='Auteur' className='login' defaultValue={material?.descr?.author || ''} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('author', e.target.value)} }}/>
        <br />
        <input type="url" name='cover' placeholder='Url van de cover' className='login' defaultValue={material?.descr?.cover || ''} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('cover', e.target.value)} }}/>
        <br />
        <input type="number" name='pages' placeholder='Aantal paginas' className='login' defaultValue={material?.descr?.pages || ''} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('pages', e.target.value)} }}/>
        <br />
        <input type="text" name='readinglevel' placeholder='Lees niveau' className='login' defaultValue={material?.descr?.readinglevel || ''} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('readinglevel', e.target.value)} }}/>
        <br />
        <input type="text" name='isbn' placeholder='ISBN' className='login' value={isbn} onInput={(e) => handleIsbn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') {e.preventDefault(); handleChange('isbn', isbn)} }} />
        <br />
        <input type="checkbox" placeholder='Beschikbaar' checked={isChecked} onChange={(e) => {setIsChecked(e.target.checked); handleChange('available', isChecked)}} />
        <label htmlFor="">Beschikbaar</label>
        <br />
      </form>
      </div>}
    </div>
  );
}

export default ChangeMaterial;