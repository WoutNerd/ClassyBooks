import "../../App.css"
import { post, Title } from "../../functions"
import crypto from "crypto-js"

const StudentLogin = () => {
    Title("Leerling login")

    const handleSubmit = (event) => {
        event.preventDefault();
        var { clss, number, pass } = document.forms[0];

        var sha256 = crypto.SHA256(clss.value+number.value+pass.value).toString();
        var md5 = crypto.MD5(clss.value+number.value+pass.value+sha256).toString();
        const body = {clss, number, sha256, md5};
        const response = post('/loginPupil', body)
        if (response.privilege != 0) {
            alert("Leerkrachten en beheerders moeten zich inloggen via de loginpagina voor leerkrachten")
            window.location.replace('../leerkracht')
        }else if (response.privilege === 0) {
            document.cookie = "sessionId=" + response.sessionid + ";path=../";
            document.cookie = "userId=" + response.userid + ";path=../"
        }

    }

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