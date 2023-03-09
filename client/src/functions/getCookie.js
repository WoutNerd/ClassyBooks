function getCookie(cookieName) {
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

  export default getCookie