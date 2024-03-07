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
    document.title = "Classy Books - " + title
  })
}

//checks if user is privileged to the page
export async function checkUser(privilege) {
  const sessionid = getCookie("sessionId");
  const userid = getCookie("userId");
  const body = { sessionid, userid };
  const response = await post('/getUser', body, 'checkuser')

  if (response.privilege >= privilege) { }
  else if (response.privilege === null && privilege === 0) { }
  else {
    alert('Je bent niet gemachtigd om deze pagina te bezoeken.')
    window.location.replace('./#')
  }
}


//post to given url
export async function post(url, body, func) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' ,'Function':func },
    });
    
    const respType = await response.headers.get('Content-Type')
    
    let data = null

    if (respType.includes('application/json')) {
      data = response.json()
      if (response.statusText !== "OK") {
        throw new Error(response);
      }
    }
    else if (respType.includes('text/plain')) {
      data = response
    }

    return data
  }
  catch (error) {
    console.error('Error:', error.message);
  }
}

//changes password of user
export async function changePassword(sha256, md5, newSha256, newMd5) {
  const sessionId = getCookie('sessionId')
  const userid = getCookie('userId')

  const body = { sessionId, userid, sha256, md5, newSha256, newMd5 }
  const resp = await post('/changePassword', body)

  if (resp === 'Changed password') {
    alert('Wachtwoord succesvol veranderd')
    window.location.replace('../../#')
  }
}