import fetch from 'node-fetch';
import getCookie from "./getCookie?js"

async function checkUser() {
    const sessionid = getCookie("sessionId").toString();
    const userid = getCookie("userId").toString();
    const body = {sessionid,userid};
    try {
        // Make the HTTP request
        const response = await fetch('/getUser', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });
        
        const data = await response.json();

        // Check if the request was successful
        if (response.statusText !== "OK") {
          throw new Error(response);
        }
  
        if (response.statusText === "OK"){
         if (data.privileged != "1") {
          window.location.replace("../#")
         }
        }
      } catch (error) {
        // Handle the error
        console.error('Error:', error.message);
        alert(error.message);
    }
    
}

export default checkUser