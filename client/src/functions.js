import './App.css';
import fetch from 'node-fetch'
import { useEffect, useState } from 'react';

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
  else if (response.privilege == null && privilege === 0) { }
  else {
    alert('Je bent niet gemachtigd om deze pagina te bezoeken.')
    window.location.replace('../#')
  }
}


//post to given url
export async function post(url, body, func) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'Function': func },
    });

    const respType = await response.headers.get('Content-Type')

    let data

    if (respType.includes('application/json')) {
      data = response.json()
      if (response.statusText !== "OK") {
        throw new Error(response);
      }
    }
    else if (respType.includes('text')) {
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
    return true
  }else return false
}

export async function getISBN(isbn) {

  if (isbn == null || isbn == ``) { console.error(`Lege ISBN`); return null }
  else {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDk85GonrKmFwTl2Iy9WxEdI-Z-Yh34oP4`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.totalItems === 0) {
        throw new Error('No book found with the provided ISBN.');
      }

      return data.items[0].volumeInfo;  // Return the first book's volume info
    } catch (error) {
      console.error('Error fetching book data:', error);
      return null;
    }
  }
}

export const Toast = ({ message, type = 'info', duration = 30000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide the toast after the specified duration
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose(); // Call onClose function when the toast hides
    }, duration);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [duration, onClose]);

  if (!visible) return null; // Render nothing if the toast is hidden

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={() => setVisible(false)}>
        &times;
      </button>
    </div>
  );
};

