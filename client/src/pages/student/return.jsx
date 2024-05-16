import { useNavigate } from 'react-router-dom'
import '../../App.css'
import { Title, checkUser, getCookie, post } from '../../functions';
import { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



const ReturnBooks = () => {
  checkUser(0)
  Title('inleveren')

  const [book, setBook] = useState(null)
  const [rating, setRating] = useState(null)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userid = getCookie('userId')
        const sessionid = getCookie('sessionId')
        const userBody = {sessionid, userid}
        const user = await post('/getUser', userBody)
        
        const materialid = user.materials[0]
        const body = { materialid, sessionid }
        const response = await post("/getMaterial", body);
        setBook(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };


  const handleClick = async () => {
    const body = {'materialid': book.materialid, 'score': rating, 'fullyread': isChecked}
    if(rating === null) alert('Geef je boek eerst een score')
    else if(window.confirm('Bent u zeker dat u '+book.title+' wilt inleveren met een score van '+rating+'/4?')){
      const resp = await post('/returnMaterial', body)
      if(resp === 'Successfully returned material') alert('Succesvol ingeleverd');
      else if(resp === 'Invalid request') alert('Inleveren mislukt probeer later opnieuw'); redirectToPage('../leerling/bibliotheek')
    }
  }

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
  }
  	
  return (
    <div>
      {book ? <Box className="" sx={{'& > legend': { mt: 2 },}}>
        <Typography  >Hoeveel sterren geef je het boek?</Typography>
        <Rating
          name="simple-controlled"
          value={rating}
          max={4}
          onChange={(event, newValue) => {
            setRating(newValue+0.0);
          }}
        />
        <input type="checkbox" name="fullyRead" id="fullyRead" checked={isChecked} onChange={handleChange}/>
        <label htmlFor="fullyRead">Volledig gelezen?</label>
        <button className="button" onClick={() => {handleClick()}}>Lever {book.title} in</button>
      </Box> : <div></div>}
    </div>
  );
}

export default ReturnBooks;