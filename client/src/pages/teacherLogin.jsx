import React, { useState, useEffect } from "react";
import "../App.css";
import crypto from "crypto-js";
import fetch from 'node-fetch';


function TeacherLogin() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const request = async (name, surname, sha256, md5) => {
      
    const body = {name, surname, sha256, md5};
    try {
      // Make the HTTP request
      const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
    
      // Check if the request was successful
      if (response.statusText !== "OK") {
        throw new Error('Ongeldige login gegevens');
      }

      if (response.statusText === "OK"){
        setIsSubmitted(true)
      }
    
      // Handle the successful response
      console.log("response");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      // Handle the error
      console.error('Error:', error.message);
      alert(error.message);
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
        {isSubmitted ? window.location.replace("overzicht") : renderForm}
      </div>
    </div>
  );
}


export default TeacherLogin;