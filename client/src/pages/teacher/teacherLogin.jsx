import "../../App.css";
import crypto from "crypto-js";
import { post, Title } from "../../functions";
import {useNavigate} from 'react-router'

function TeacherLogin() {
Title("Leerkracht login")

const navigate = useNavigate();

const redirectToPage = (path) => {
  navigate(path); // Use navigate to go to the specified path
};

  const request = async (name, surname, sha256, md5) => {
      
    const body = {name, surname, sha256, md5};
    const response = await post('/loginTeacher', body)

      document.cookie = "sessionId=" + response.sessionid + ";path=../";
      document.cookie = "userId=" + response.userid + ";path=../"
    
      if (response.privilege === 1) {
        redirectToPage("../leerkracht/overzicht")
      }
      if (response.privilege === 2) {
        redirectToPage("../beheer/gebruikers-beheren")
      }
    }
  
  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { name, surname, pass } = document.forms[0];

    var sha256 = crypto.SHA256(name.value+surname.value+pass.value).toString();
    var md5 = crypto.MD5(name.value+surname.value+pass.value+sha256).toString();
    request(name.value, surname.value, sha256, md5);
    
  };


  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" name="name" required placeholder="Voornaam" className="login" autoFocus/>
        </div>
        <div className="input-container">
          <input type="text" className="login" name="surname" required placeholder="Achternaam"/>
        </div>
        <div className="input-container">
          <input type="password" name="pass" required placeholder="Wachtwoord" className="login"/>
        </div>
        <div className="button-container">
          <input type="submit" value={"Login"} className="login-button"/>
        </div>
      </form>
    </div>
  );



  
  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Log in</div>
        {renderForm}
      </div>
    </div>
  );
}


export default TeacherLogin;