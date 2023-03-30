import './App.css'

const UserTyperChoise= () => {


    return ( 
        <div>
            <h2>Als wie wil je inloggen?</h2>
            <button onClick={() => window.location.replace('./leerkracht')}>Leerkracht</button>
            <button onClick={() => window.location.replace('./leerling')}>Leerling</button>
        </div>
     );
}
 
export default UserTyperChoise