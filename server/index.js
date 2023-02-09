//-------------------------------------------------------------------------------------IMPORTS-------//
const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
var crypto = require("crypto");
const { Sequelize } = require("sequelize-cockroachdb");
const { faker } = require('@faker-js/faker/locale/nl_BE');
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

leesniveaus = ["AVI-START", "AVI-M3", "AVI-E3", "AVI-M4", "AVI-E4", "AVI-M5", "AVI-E5", "AVI-M6", "AVI-E6", "AVI-M7", "AVI-E7", "AVI-PLUS"]
//-----------------------------------------------------------------------------------REQUESTS-------//
app.use(express.static(__dirname + "/../client/build/"));
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/../client/build/index.html");
});

//-------------------------------------------------------------------------------API-REQUESTS-------//
app.post("/login", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      sessionId = await login(req["body"]["name"], req["body"]["surname"], req["body"]["sha256"], req["body"]["md5"])
      if (sessionId == "Invalid credentials") { res.status(400).send(sessionId) }
      else { res.setHeader('content-type', 'text/plain'); res.status(200).send(sessionId) }
    }
    else { res.status(400).send("Invalid credentials") }

  })();
})

app.post("/createUser", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      session = await getSession(req["body"]["sessionid"])
      if (session['privileged'] == '1') {
        await addUserWithHash(req["body"]["name"], req["body"]["surname"], req["body"]["privileged"], req["body"]["sha256"], req["body"]["md5"], "0")
        res.setHeader('content-type', 'text/plain'); res.status(200).send("Successfully added user")
      }
      else { res.status(400).send("Invalid session") }
    }
    else { res.status(400).send("Invalid request") }

  })();
})
app.post("/getMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      session = await getSession(req["body"]["sessionid"])
      material = await request(`SELECT * FROM MATERIALS WHERE MATERIALID='${req["body"]["materialid"]}'`)
      if (material[1]["rowCount"] > 0) {
        if (session['privileged'] == '1') { res.status(200).send(material[0]) }
        else { res.status(200).send(stripInfo(material, ["lendoutto", "returndate", "available"])) }
      }
      else res.status(400).send("Invalid material")
    }
  })();
})
//------------------------------------------------------------------------------------SQL SERVER----//
settings = JSON.parse(fs.readFileSync("./server/settings.json"));

const sequelize = new Sequelize(settings["url"]);

async function request(request) {
  try {

    const [results, metadata] = await sequelize.query(request);
    return [results, metadata];
  } catch (err) {
    return err;
  }
}

//-------------------------------------------------------------------------------------FUNCTIONS----//
function generateHashes(name, surname, password) {
  var sha256 = crypto
    .createHash("sha256")
    .update(name + surname + password)
    .digest("hex");
  var md5 = crypto
    .createHash("md5")
    .update(name + surname + password + sha256.toString())
    .digest("hex");
  return [sha256.toString(), md5.toString()];
}

function checkString(str) {
  //Returns false when string is not good
  return !(new RegExp(/(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})/, "gi").test(str))
}
function checkRequest(req) {
  let stringGood = true
  Object.keys(req["body"]).forEach((key) => {
    if (!checkString(req["body"][key])) { stringGood = false }
  })
  return stringGood
}

function stripInfo(dbres, keys) {
  d = dbres[0]
  for (let i = 0; i < keys.length; i++) {
    d[keys[i]] = null
  }
  return d
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}
//----------------------------------------------------------------------------DATABASE-FUNCTIONS----//

async function addUserWithPass(name, surname, password, privileged, materials) {
  let hashes = generateHashes(name, surname, password);
  await addUserWithHash(name, surname, privileged, hashes[0], hashes[1], materials)
}

async function addUserWithHash(name, surname, privileged, sha256, md5, materials) {
  let privilegedBit = 0;
  if (privileged) {
    privilegedBit = 1;
  }
  await request(`INSERT INTO USERS (firstname, lastname, privileged, sha256, md5, materials) VALUES ('${name}', '${surname}', '${privilegedBit}', '${sha256}', '${md5}', '${materials}');`);

}

async function addMaterial(title, place, description, available) {

  let availableBit = 0;
  if (available) {
    availableBit = 1;
  }
  await request(`INSERT INTO MATERIALS (title, place, descr, available) VALUES ('${title}', '${place}', '${description}', '${availableBit}');`);
}

async function login(name, surname, sha256, md5) {
  let d = await request(`SELECT * FROM USERS WHERE FIRSTNAME='${name}' AND LASTNAME='${surname}'`)
  let i = 0
  let sessionId = ""
  while (i < d[0].length) {
    let dbsha256 = d[0][i]["sha256"]
    let dbmd5 = d[0][i]["md5"]
    if (dbsha256 == sha256 && dbmd5 == md5) {
      //Correct credentials
      sessionId = uuidv4().toString()
      time = new Date().addHours(5)
      await request(`UPDATE USERS SET SESSIONID='${sessionId}', SESSIONIDEXPIRE='${time.toISOString()}' WHERE FIRSTNAME='${name}' AND LASTNAME='${surname}'`)
    }
    i += 1
  }
  if (sessionId == "") {
    sessionId = "Invalid credentials"
  }
  return sessionId

}

async function getSession(sessionId) {
  user = await request(`SELECT * FROM USERS WHERE SESSIONID='${sessionId}'`)
  if (user[1]["rowCount"] > 0) {
    expiry = new Date(user[0][0]["sessionidexpire"])
    if (new Date().getTime() < expiry.getTime()) {
      return user[0][0]
    }
    else return null
  }
  else return null

}

//--------------------------------------------------------------------------------------------------//

(async () => {
  console.log("Starting")
  await sequelize.authenticate()
  i = 0
  while (i < 20) {
    let leesniveau = leesniveaus[Math.floor(Math.random() * leesniveaus.length)]
    //await addUserWithPass(faker.name.firstName(), faker.name.lastName(), "password", false, "0")
    //await addMaterial(faker.word.adjective() + " " + faker.word.noun(), leesniveau, JSON.stringify({ "author": faker.name.fullName(), "pages": Math.floor(Math.random() * 200) + 10, "cover": faker.image.abstract(1080, 1620), "readinglevel": leesniveau }), false)
    i++
  }
})();


