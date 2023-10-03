import React, { useState } from "react";
import "../../App.css";
import crypto from "crypto-js";
import { checkUser, getCookie, Title, post } from "../../functions";
import {useNavigate} from 'react-router'
import TeacherNavbar from "../teacher/teacherNavbar";


function AddUser() {
  Title('Gebruiker Toevoegen')
  checkUser(2);


  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path); // Use navigate to go to the specified path
  };
  // React States
  const [isSubmitted] = useState(false);

  const [isCheckedT, setIsCheckedT] = useState(false);
  const [isCheckedA, setIsCheckedA] = useState(false);

  const sessionid = getCookie("sessionId")
   



  const request = async (name, surname, sha256, md5, privileged) => {
    const body = {sessionid, name, surname, sha256, md5, privileged};
     post('/createUser', body)
  
}




  function handleChangeT(e) {
    if(isCheckedT === true){
      setIsCheckedT(e.target.checked);
    }else if(isCheckedT === false){
      setIsCheckedT(e.target.checked);
      setIsCheckedA(!e.target.checked);
    }
  }

  function handleChangeA(e) {
    if(isCheckedA === true){
      setIsCheckedA(e.target.checked); 
    }else if(isCheckedA === false){
      setIsCheckedA(e.target.checked);
      setIsCheckedT(!e.target.checked);
    }
  }


  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { name, surname, pass,} = document.forms[0];

    

    var sha256 = crypto.SHA256(name.value+surname.value+pass.value).toString();
    var md5 = crypto.MD5(name.value+surname.value+pass.value+sha256).toString();
    var privileged = 0

    if (isCheckedA === 1){
      privileged = 2
    } else if (isCheckedT === 1){
      privileged = 1
    }

    request(name.value, surname.value, sha256, md5, privileged);
    
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
          <input type="text" name="pass" required placeholder="Wachtwoord" className="login"/>
        </div>
        <div className="input-container">
          <label htmlFor="">Leerkracht</label>
          <input type="checkbox" className="login" label="leerkracht" checked={isCheckedT} onChange={handleChangeT}/>
        </div>
        <div className="input-container">
          <label htmlFor="">Beheerder</label>
          <input type="checkbox" className="login" label="beheerder" checked={isCheckedA} onChange={handleChangeA} />
        </div>
        <div className="button-container">
          <input type="submit" value="Voeg gebruiker toe" className="login-button"/>
        </div>
      </form>
    </div>
  );



  
  return (
    <div className="app">
      <nav><TeacherNavbar/></nav>
      <div className="login-form">
        <div className="title">Log in</div>
        {isSubmitted ? redirectToPage("overzicht") : renderForm}
      </div>
    </div>
  );
}


export default AddUser;