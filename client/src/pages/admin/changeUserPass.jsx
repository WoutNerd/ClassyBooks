import { useState, useEffect } from 'react';
import '../../App.css'
import { getCookie, post, Title } from '../../functions';
import crypto from 'crypto-js';
import TeacherNavbar from '../teacher/teacherNavbar';


const ChangeUserPass =  () => {
    Title('Verander wachtwoord van gebruiker')

    const [user, setUser] = useState(null)
    const userid = getCookie('changePwUser')
    const sessionid = getCookie('sessionId')
    

    const handleSubmit = () => {
      
      const userId = userid
      const sessionId = sessionid
      const Newpass = document.getElementById('Newpass').value
      const NewpassCheck = document.getElementById('NewpassCheck').value

      if(Newpass.value !== NewpassCheck.value){
        alert('Voer 2 maal hetzelfde wachtwoord in.')
      }
      if(Newpass.value === NewpassCheck.value){
        var newSha256 = crypto.SHA256(user.firstname+user.lastname+Newpass.value).toString();
        var newMd5 = crypto.MD5(user.firstname+user.lastname+Newpass.value+newSha256).toString();
        const body = {sessionId, newSha256, newMd5, userId} 
        if(window.confirm('Bent u zeker dat u '+user.firstname+' '+user.lastname+' zijn/haar wachtwoord wilt veranderen in "'+Newpass+'"')){
          post('/changePassword', body)
        }
      }
      

    }

    useEffect(() => {
        const fetchData = async () => {
          const userid = getCookie('changePwUser')
          const sessionid = getCookie('sessionId')
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
      
    return ( <div>
      <nav><TeacherNavbar/></nav>
        <div>
            {user.firstname+' '+user.lastname}
            <form onSubmit={(event) => {event.preventDefault(); handleSubmit()}}>
            <div className="input-container">
          <input type="password" name="Newpass" required placeholder="Nieuw wachtwoord" id='Newpass' className="login"/>
        </div>
        <div className="input-container">
          <input type="password" name="NewpassCheck" required placeholder="Bevestig nieuw wachtwoord" id="NewpassCheck" className="login"/>
        </div>
        <div className="button-container">
          <input type="submit" value={"Verander wachtwoord"} className="button"/>
        </div>
        </form>
        </div>
        </div>
     );
}
 
export default ChangeUserPass;