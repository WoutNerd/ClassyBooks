import React, { useState } from "react";
import "../../App.css";
import crypto from "crypto-js";
import { checkUser, getCookie, Title, post, Toast } from "../../functions";
import { useNavigate } from 'react-router'
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

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(``)
  const [toastType, setToastType] = useState(``)

  const sessionid = getCookie("sessionId")




  const request = async (name, surname, sha256, md5, privilege, clss, num, readinglevel) => {
    const body = { sessionid, name, surname, sha256, md5, privilege, 'cls': clss, 'classNum': num, readinglevel };
    const resp = await post('/createUser', body)
    if (resp.status === 200) {
      setShowToast(true)
      setToastMessage(`Gerbruiker succesvol gecreëerd.`)
      setToastType(`succes`)
    } else {
      setShowToast(true)
      setToastMessage(`Gebruiker creëren mislukt. Probeer opnieuw.`)
      setToastType(`error`)
    }

  }




  function handleChangeT(e) {
    if (isCheckedT === true) {
      setIsCheckedT(e.target.checked);
    } else if (isCheckedT === false) {
      setIsCheckedT(e.target.checked);
      setIsCheckedA(!e.target.checked);
    }
  }

  function handleChangeA(e) {
    if (isCheckedA === true) {
      setIsCheckedA(e.target.checked);
    } else if (isCheckedA === false) {
      setIsCheckedA(e.target.checked);
      setIsCheckedT(!e.target.checked);
    }
  }


  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { name, surname, pass, clss, num, readinglevel } = document.forms[0];
    let privileged = 0
    if (isCheckedA === true) {
      privileged = 2
    } else if (isCheckedT === true) {
      privileged = 1
    }

    if (privileged === 0) {
      var sha256 = crypto.SHA256(clss.value + num.value + pass.value).toString();
      var md5 = crypto.MD5(clss.value + num.value + pass.value + sha256).toString();
    } else {
      sha256 = crypto.SHA256(name.value + surname.value + pass.value).toString();
      md5 = crypto.MD5(name.value + surname.value + pass.value + sha256).toString();
    }





    request(name.value, surname.value, sha256, md5, parseInt(privileged), clss.value, parseInt(num.value), readinglevel.value);

  };



  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" name="name" required placeholder="Voornaam" className="login" autoFocus />
        </div>
        <div className="input-container">
          <input type="text" className="login" name="surname" required placeholder="Achternaam" />
        </div>
        <div className="input-container">
          <input type="text" name="clss" required={!(isCheckedA || isCheckedT)} placeholder="Klas" className="login" />
        </div>
        <div className="input-container">
          <input type="text" name="num" required={!(isCheckedA || isCheckedT)} placeholder="Nummer" className="login" />
        </div>
        <div className="input-container">
          <input type="text" name="readinglevel" required={!(isCheckedA || isCheckedT)} placeholder="Leesniveau" className="login" />
        </div>
        <div className="input-container">
          <input type="text" name="pass" required placeholder="Wachtwoord" className="login" />
        </div>
        <div className="input-container">
          <label htmlFor="">Leerkracht</label>
          <input type="checkbox" className="login" label="leerkracht" checked={isCheckedT} onChange={handleChangeT} />
        </div>
        <div className="input-container">
          <label htmlFor="">Beheerder</label>
          <input type="checkbox" className="login" label="beheerder" checked={isCheckedA} onChange={handleChangeA} />
        </div>
        <div className="button-container">
          <input type="submit" value="Voeg gebruiker toe" className="button" />
        </div>
      </form>
    </div>
  );




  return (
    <div className="app">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() =>setShowToast(false)}
        />
      )}
      <nav><TeacherNavbar /></nav>
      <div className="login-form">
        <div className="title">Voeg gebruiker toe</div>
        {isSubmitted ? redirectToPage("overzicht") : renderForm}
        <button onClick={() => redirectToPage(`../beheer/json-upload`)}>Importeren</button>
      </div>
    </div>
  );
}


export default AddUser;