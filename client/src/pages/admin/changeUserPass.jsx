import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, post, Title } from '../../functions';
import crypto from 'crypto-js';


const ChangeUserPass =  () => {
    Title('Verander wachtwoord van gebruiker')

    const [user, setUser] = useState(null)
    const userid = getCookie('changePwUser')
    const sessionid = getCookie('sessionId')
    

    const handleSubmit = () => {
      const userId = userid
      const sessionId = sessionid
      const {Newpass, NewpassCheck} = document.form[0]
      if(Newpass.value != NewpassCheck.value){
        alert('Voer 2 maal hetzelfde wachtwoord in.')
      }
      if(Newpass.value === NewpassCheck.value){
        var newSha256 = crypto.SHA256(user.firstname+user.lastname+Newpass.value).toString();
        var newMd5 = crypto.MD5(user.firstname+user.lastname+Newpass.value+newSha256).toString();
        const body = {sessionId, newSha256, newMd5, userId} 
        console.log(body)
      }
      

    }

    useEffect(() => {
        const fetchData = async () => {
          try {
          const body = {sessionid, userid}
          const response = await post("/getUser", body)
          setUser(response);
          } catch (error) {
            console.error(error)
          }
        };
    
        fetchData();
      }, []);

      if (!user) {
        return <div>Loading...</div>;
      }
      
    return ( 
        <div>
            {user.firstname+' '+user.lastname}
            <form onSubmit={() => {console.log()}}>
            <div className="input-container">
          <input type="password" name="Newpass" required placeholder="Nieuw wachtwoord" className="login"/>
        </div>
        <div className="input-container">
          <input type="password" name="NewpassCheck" required placeholder="Bevestig nieuw wachtwoord" className="login"/>
        </div>
        <div className="button-container">
          <input type="button" onClick={() => {handleSubmit()}} value={"Verander wachtwoord"} className="login-button"/>
        </div>
        </form>
        </div>
     );
}
 
export default ChangeUserPass;