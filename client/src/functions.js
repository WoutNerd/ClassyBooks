import "./App.css";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
const cheerio = require("cheerio");

//extracs cookie zith given name
export function getCookie(cookieName) {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();

    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1, cookie.length);
    }
  }

  return null;
}

//changes title
export function Title(title) {
  useEffect(() => {
    document.title = "Classy Books - " + title;
  });
}

//checks if user is privileged to the page
export async function checkUser() {
  const url = window.location.href;
  let privilege = 0;
  if (url.includes("beheer/")) {
    privilege = 2;
  } else if (url.includes("leerkracht/")) {
    privilege = 1;
  }
  const sessionid = getCookie("sessionId");
  const userid = getCookie("userId");
  const body = { sessionid, userid };
  const response = await post("/getUser", body, "checkuser", true);

  if (response.privilege >= privilege) {
  } else if (response.privilege == null && privilege === 0) {
  } else {
    alert("Je bent niet gemachtigd om deze pagina te bezoeken.");
    window.location.replace("../#");
  }
}

// post to given URL with cache
export async function post(url, body, func, skipCache) {
  const ttl = 6 * 1000; // 6 seconds
  const cached = sessionStorage.getItem(url);

  let cacheKey = url;

  if (url.includes("create")) {
    skipCache = true;
  }

  if (url === "/getUser") {
    if (
      body.userid === getCookie("userId") ||
      body.userId === getCookie("userId")
    ) {
      cacheKey = "self";
    } else {
      skipCache = true;
    }
  }

  // Check if cached respons e is still valid
  if (cached && !skipCache) {
    const { data, time } = JSON.parse(cached);
    if (Date.now() - time < ttl) {
      console.log("Returning cached response for", url);
      return data;
    }
  }

  // Otherwise, fetch from network
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Function: func,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else if (contentType.includes("text")) {
      data = await response.text();
    } else {
      data = await response.blob(); // fallback for other content types
    }

    // Cache it with timestamp
    sessionStorage.setItem(
      url,
      JSON.stringify({
        data,
        time: Date.now(),
      })
    );

    console.log("Fetched and cached new response for", url);
    return data;
  } catch (error) {
    console.error("Error in post():", error);
  }
}

//changes password of user
export async function changePassword(sha256, md5, newSha256, newMd5) {
  const sessionId = getCookie("sessionId");
  const userid = getCookie("userId");

  const body = { sessionId, userid, sha256, md5, newSha256, newMd5 };
  const resp = await post("/changePassword", body);

  if (resp === "Changed password") {
    return true;
  } else return false;
}

export async function getISBN(isbn) {
  if (!isbn || isbn === "") {
    console.error("Lege ISBN");
    return null;
  }

  try {
    const titelbankResp = await fetch(`/getTitelbank/${isbn}`);
    if (titelbankResp.status === 200) {
      let data = await titelbankResp.json();
      data[0].authors = [data[0].author];
      return data[0];
    }
  } catch (error) {
    throw new Error(`titelbank error: ${error}`);
  }

  try {
    // Zoek in Google Books API
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDk85GonrKmFwTl2Iy9WxEdI-Z-Yh34oP4`;
    const googleBooksResponse = await fetch(googleBooksUrl);

    if (!googleBooksResponse.ok) {
      throw new Error(`Google Books API fout: ${googleBooksResponse.status}`);
    }

    const googleBooksData = await googleBooksResponse.json();

    if (googleBooksData.totalItems > 0) {
      return googleBooksData.items[0].volumeInfo; // Retourneer het eerste resultaat
    } else {
      console.warn(
        "Geen boek gevonden in Google Books. Nu zoeken in OpenLibrary..."
      );
    }
  } catch (error) {
    console.error("Fout bij het ophalen van data uit Google Books:", error);
  }

  try {
    // Zoek in OpenLibrary API
    const openLibraryUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const openLibraryResponse = await fetch(openLibraryUrl);

    if (!openLibraryResponse.ok) {
      throw new Error(`OpenLibrary API fout: ${openLibraryResponse.status}`);
    }

    const openLibraryData = await openLibraryResponse.json();
    const bookData = openLibraryData[`ISBN:${isbn}`];

    if (bookData) {
      console.log("Boek gevonden in OpenLibrary:", bookData);
      return bookData; // Retourneer de OpenLibrary data
    } else {
      console.warn("Geen boek gevonden in OpenLibrary.");
    }
  } catch (error) {
    console.error("Fout bij het ophalen van data uit OpenLibrary:", error);
  }

  try {
    const resp = await post("/getBibInfo", { isbn });
    const htmlResp = await resp.text();
    const $ = cheerio.load(await htmlResp);

    // Extract the title
    const title = $("h3.catalog-item-title").text().trim();

    // Extract the authors
    const authors = [];
    $("div.catalog-item__authors a").each((i, el) => {
      authors.push($(el).text().trim());
    });
    return { title, authors };
  } catch (error) {
    console.error(
      "Fout bij het ophalen van data uit bibliotheek vlaanderen:",
      error
    );
  }

  return null; // Retourneer null als geen enkel boek is gevonden
}

export const Toast = ({
  message,
  type = "info",
  duration = 30000,
  onClose,
}) => {
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
