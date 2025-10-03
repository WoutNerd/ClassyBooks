import '../App.css'
import { useNavigate } from 'react-router';
import { Title } from '../functions';



const UserTyperChoise= () => {
  Title('')
const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };

    return ( 
        <div>
            <h2>Als wie wil je inloggen?</h2>
            <button onClick={() => redirectToPage('./leerkracht-login')} className='button big'>Leerkracht</button>
            <button onClick={() => redirectToPage('./leerling')} className='button big'>Leerling</button>
        </div>
     );
}
 
export default UserTyperChoise