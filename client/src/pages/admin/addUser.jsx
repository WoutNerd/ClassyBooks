import React, { useState, useEffect } from "react";
import "../../App.css";
import crypto from "crypto-js";
import fetch from 'node-fetch';
import { checkUser, getCookie } from "../../functions";
//import { useEffect } from "react";

function AddUser() {
  checkUser();
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const sessionid = getCookie("sessionId")
   
  //changes title
 // useEffect(() => {
    document.title = "Classy Books - Voeg gebruiker toe"
 // }, []);


  const request = async (name, surname, sha256, md5, privileged) => {
    const body = {sessionid, name, surname, sha256, md5, privileged};
    try {
      // Make the HTTP request
      const response = await fetch('/createUser', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
   

    } catch (error) {
      // Handle the error
      console.error('Error:', error.message);
      alert(error.message);
    }
  
}


  function handleChange(e) {
    setIsChecked(e.target.checked);
  }


  const errors = {
    error: "Ongeldige gebruikersnaam of wachtwoord probeer opnieuw.",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { name, surname, pass,} = document.forms[0];

    

    var sha256 = crypto.SHA256(name.value+surname.value+pass.value).toString();
    var md5 = crypto.MD5(name.value+surname.value+pass.value+sha256).toString();
    request(name.value, surname.value, sha256, md5, isChecked);
    
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
        </div>
        <div className="input-container">
          <input type="text" className="login" name="surname" required placeholder="Achternaam"/>
        </div>
        <div className="input-container">
          <input type="text" name="pass" required placeholder="Wachtwoord" className="login"/>
        </div>
        <div className="input-container">
          <label htmlFor="">Leerkracht</label>
          <input type="checkbox" className="login" label="leerkracht" checked={isChecked} onChange={handleChange}/>
        </div>
        <div className="button-container">
          <input type="submit" value="Voeg gebruiker toe" className="login-button"/>
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


export default AddUser;