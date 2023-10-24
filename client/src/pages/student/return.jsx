import { useNavigate } from 'react-router-dom'
import '../../App.css'
import { Title, checkUser, getCookie, post } from '../../functions';
import { useEffect, useState } from 'react';



const ReturnBooks = () => {
  checkUser(0)
  Title('inleveren')
  
  const [book, setBook] = useState(null)
  const [star1, setStar1] = useState('rating__star')
  const [star2, setStar2] = useState('rating__star')
  const [star3, setStar3] = useState('rating__star')
  const [star4, setStar4] = useState('rating__star')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialid = getCookie('materialid')
        const sessionid = getCookie('sessionId')
        const body = {materialid, sessionid}
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

  const ratingStars = [...document.getElementsByClassName("rating__star")];

function executeRating(stars) {
  const starClassActive = "rating__star checked";
  const starClassInactive = "rating__star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className===starClassInactive) {
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
      }
    };
  });
}
executeRating(ratingStars);
  
    return ( 
        <div>
          {book ? <div class="rating">
          <i className={star1}>&#9734;</i>
          <i className={star2}>☆</i>
          <i className={star3}>☆</i>
          <i className={star4}>☆</i>
   </div>:<div>{redirectToPage('/leerling/bibliotheek')}</div>}
        </div>
     );
}
 
export default ReturnBooks;