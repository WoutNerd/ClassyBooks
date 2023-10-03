import "../../App.css";
import crypto from "crypto-js";
import { Title, changePassword } from "../../functions";
import TeacherNavbar from "./teacherNavbar";

function TeacherChangePassword() {
  Title("Verander wachtwoord")


  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { name, surname, Oldpass, Newpass, NewpassCheck } = document.forms[0];

    if (Newpass.value === NewpassCheck.value) {
      var sha256 = crypto.SHA256(name.value + surname.value + Oldpass.value).toString();
      var md5 = crypto.MD5(name.value + surname.value + Oldpass.value + sha256).toString();

      var newSha256 = crypto.SHA256(name.value + surname.value + Newpass.value).toString();
      var newMd5 = crypto.MD5(name.value + surname.value + Newpass.value + newSha256).toString();

      changePassword(sha256, md5, newSha256, newMd5)
    } else {
      alert('Wachtwoorden komen niet overeen')


    }


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
          <input type="password" name="Oldpass" required placeholder="Oud wachtwoord" className="login" />
        </div>
        <div className="input-container">
          <input type="password" name="Newpass" required placeholder="Nieuw wachtwoord" className="login" />
        </div>
        <div className="input-container">
          <input type="password" name="NewpassCheck" required placeholder="Bevestig nieuw wachtwoord" className="login" />
        </div>
        <div className="button-container">
          <input type="submit" value={"Login"} className="login-button" />
        </div>
      </form>
    </div>
  );




  return (
    <div className="app">
      <nav className="navbar">
        <TeacherNavbar/>      </nav>
      <div className="login-form">
        <div className="title">Verander wachtwoord</div>
        {renderForm}
      </div>
    </div>
  );
}


export default TeacherChangePassword;