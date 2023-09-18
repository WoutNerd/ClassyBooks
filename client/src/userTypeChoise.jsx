import './App.css'
import { useNavigate } from 'react-router';



const UserTyperChoise= () => {
const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };

    return ( 
        <div>
            <h2>Als wie wil je inloggen?</h2>
            <button onClick={() => redirectToPage('./leerkracht')}>Leerkracht</button>
            <button onClick={() => redirectToPage('./leerling')}>Leerling</button>
        </div>
     );
}
 
export default UserTyperChoise