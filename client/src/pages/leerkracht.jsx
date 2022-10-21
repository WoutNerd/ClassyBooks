import "../App.css";
const Leerkracht = () => {
    return ( 
        <div>
            <form action="/">
                <input type="text" name="Gebruikersnaam"  placeholder="Gebruikersnaam" />
                <br />
                <input type="password" name="Wachtwoord" placeholder="Wachtwoord" />
                <br />
                <input type="submit"className="button" />
            </form>
            
        </div>
     );
}
 
export default Leerkracht;