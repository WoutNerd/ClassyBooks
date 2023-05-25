import fetch from 'node-fetch'
import { useEffect } from 'react';

//extracs cookie zith given name
export function getCookie(cookieName) {
    var cookies = document.cookie.split(';');
  
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
  
      if (cookie.startsWith(cookieName + '=')) {
        return cookie.substring(cookieName.length + 1, cookie.length);
      }
    }
  
    return null;
  }

//changes title 
export function Title(title) {
  useEffect(() => {
    document.title = "Classy Books - "+title
})
}

//checks if user is privileged to the page
export async function checkUser(privilege) {
  const sessionid = getCookie("sessionId").toString();
  const userid = getCookie("userId").toString();
  const body = {sessionid,userid};
  const response = await post('/getUser', body)
  if (response.privilege < privilege || response.privilege === null){
    alert('Je bent niet gemachtigd om deze pagina te bezoeken.')
    window.location.replace('./#')
  } 
    } 


//post to given url
export async function post(url, body) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.statusText !== "OK") {
      throw new Error(response);
    }
  return data
  }
  catch (error) {
    console.error('Error:', error.message);
  }
}

//changes password of user
export async function changePassword(sha256, md5, newSha256, neMd5){
  const sessionId = getCookie('sessionId')
  const body = {sessionId, sha256, md5, newSha256, neMd5}
  const resp =  await post('/changePassword', body)

  if(resp === 'Changed password'){
    alert('Wachtwoord succesvol veranderd')
    window.location.replace('../../#')
  }
}