import React, { useState } from "react";
import "../App.css";
import crypto from "crypto-js";


function TeacherLogin() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User Login info
  const database = [
    {
      username: "user1",
      sha256: "e6c3da5b206634d7f3f3586d747ffdb36b5c675757b380c6a5fe5c570c714349",
      md5: "a722c63db8ec8625af6cf71cb8c2d939"
    },
  ];

  const errors = {
    error: "Ongeldige gebruikersnaam of wachtwoord probeer opnieuw.",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      var sha256Pass = crypto.SHA256(pass.value).toString()
      var md5pass = crypto.MD5(pass.value).toString()
      if (userData.sha256 !== sha256Pass && userData.md5 !== md5pass) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.error });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.error });
    }
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
          <input type="text" name="uname" required placeholder="Gebruikersnaam" className="login"/>
          {renderErrorMessage("uname")}
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