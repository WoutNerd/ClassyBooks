import "../App.css";
const Leerkracht = () => {
    return ( 
        <div>
            <form action="/" >
                <br /> <p className="login">Gebruikersnaam: </p><br />
                <input type="text" name="Gebruikersnaam"  placeholder="Gebruikersnaam" className="login"/>
                <br /><p className="login">Wachtwoord:</p><br />
                <input type="password" name="Wachtwoord" placeholder="Wachtwoord" className="login"/>
                <br />
                <input type="submit" value={"Login"} className="login-button"/>
            </form>
            
        </div>
     );
}
 
export default Leerkracht;