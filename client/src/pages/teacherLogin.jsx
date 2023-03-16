import React, { useState, useEffect } from "react";
import "../App.css";
import crypto from "crypto-js";
import { post } from "../functions";


function TeacherLogin() {

    //changes title
    useEffect(() => {
      document.title = "Classy Books - Login"
    }, []);

  // React States
  const [errorMessages, setErrorMessages] = useState({});

  const request = async (name, surname, sha256, md5) => {
      
    const body = {name, surname, sha256, md5};
    const response = await post('/login', body)

      document.cookie = "sessionId=" + response.sessionid + ";path=../";
      document.cookie = "userId=" + response.userid + ";path=../"
    
      if (response.privileged == "1") {
        window.location.replace("../overzicht")
      }
      if (response.privileged == "0") {
        window.location.replace("../boeken")
      }
    }
  

  //changes title
  useEffect(() => {
    document.title = "Classy Books - Login"
  }, []);



  const errors = {
    error: "Ongeldige gebruikersnaam of wachtwoord probeer opnieuw.",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { name, surname, pass } = document.forms[0];

    var sha256 = crypto.SHA256(name.value+surname.value+pass.value).toString();
    var md5 = crypto.MD5(name.value+surname.value+pass.value+sha256).toString();
    request(name.value, surname.value, sha256, md5);
    
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" name="name" required placeholder="Voornaam" className="login" autoFocus/>
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <input type="text" className="login" name="surname" required placeholder="Achternaam"/>
        </div>
        <div className="input-container">
          <input type="password" name="pass" required placeholder="Wachtwoord" className="login"/>
          {renderErrorMessage("pass")}
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