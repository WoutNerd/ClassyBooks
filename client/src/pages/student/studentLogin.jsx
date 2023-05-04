import "../../App.css"
import { post, Title } from "../../functions"
import crypto from "crypto-js"

async function handleSubmit(event) {
    event.preventDefault();
    var { clss, number, pass } = document.forms[0];
    clss = clss.value
    number = number.value
    pass = pass.value

    var sha256 = crypto.SHA256(clss+number+pass).toString();
    var md5 = crypto.MD5(clss+number+pass+sha256).toString();
    const body = {clss, number, sha256, md5};
    const response = await post('/loginPupil', body)
    console.log(response.privilege)
    if (response.privilege != 0) {
        alert("Leerkrachten en beheerders moeten zich inloggen via de loginpagina voor leerkrachten")
   // window.location.replace('../leerkracht')
    }else if (response.privilege === 0) {
        document.cookie = "sessionId=" + response.sessionid + ";path=../";
        document.cookie = "userId=" + response.userid + ";path=../"
        window.location.replace('./boeken')
    }
}

const StudentLogin = () => {
    Title("Leerling login")



    //Login form
    const renderForm = (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input type="text" name="clss" required placeholder="Klas" className="login" autoFocus/>
            </div>
            <div className="input-container">
              <input type="number" className="login" name="number" required placeholder="Klasnummer"/>
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
 
export default StudentLogin;