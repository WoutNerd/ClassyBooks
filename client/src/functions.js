import fetch from 'node-fetch'

export function getCookie(cookieName) {
    // Split all cookies into an array
    var cookies = document.cookie.split(';');
  
    // Loop through each cookie and check if it matches the cookie name
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
  
      // If the cookie name matches, return the value of the cookie
      if (cookie.startsWith(cookieName + '=')) {
        return cookie.substring(cookieName.length + 1, cookie.length);
      }
    }
  
    // If the cookie name was not found, return null
    return null;
  }


export async function checkUser() {
  const sessionid = getCookie("sessionId").toString();
  const userid = getCookie("userId").toString();
  const body = {sessionid,userid};
  const response = post('/getUser', body)
      if (response.statusText === "OK"){
        if (response.json.privileged != "1") {
        window.location.replace("../#")
        }
      }
    } 



export async function post(url, body) {
  try {
    // Make the HTTP request
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
    // Handle the error
    console.error('Error:', error.message);
    alert(error.message);
  }}