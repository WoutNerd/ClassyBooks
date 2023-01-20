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
    sessionId = await login(req["body"]["name"], req["body"]["surname"], req["body"]["sha256"], req["body"]["md5"])
    if (sessionId == "Invalid credentials") { res.status(400).send(sessionId) }
    else { res.status(200).send(sessionId) }
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

async function addUserWithPass(name, surname, password, privileged, materials) {
  let privilegedBit = 0;
  if (privileged) {
    privilegedBit = 1;
  }
  let hashes = generateHashes(name, surname, password);
  await request(`INSERT INTO USERS (firstname, lastname, privileged, sha256, md5, materials) VALUES ('${name}', '${surname}', '${privilegedBit}', '${hashes[0]}', '${hashes[1]}', '${materials}');`);
}

async function addMaterial(title, place, description, available, daysTillReturn) {
  let today = new Date()
  today.setDate(today.getDate() + daysTillReturn)
  let returndate = today
  let availableBit = 0;
  if (available) {
    availableBit = 1;
  }
  await request(`INSERT INTO MATERIALS (title, place, descr, available, returndate) VALUES ('${title}', '${place}', '${description}', '${availableBit}', '${returndate.getFullYear()}-${(returndate.getMonth() + 1).toString().padStart(2, "0")}-${returndate.getDate().toString().padStart(2, "0")}');`);
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
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
    sessionId == "Invalid credentials"
  }
  return sessionId

}
//--------------------------------------------------------------------------------------------------//

(async () => {
  console.log("Starting")
  await sequelize.authenticate()
  i = 0
  while (i < 20) {
    await addUserWithPass(faker.name.firstName(), faker.name.lastName(), faker.random.alphaNumeric(10), false, "0")
    await addMaterial(faker.word.adjective() + " " + faker.word.noun(), leesniveaus[Math.floor(Math.random() * leesniveaus.length - 1)], JSON.stringify({ "author": faker.name.fullName(), "pages": Math.floor(Math.random() * 200) + 10 }), false, Math.floor(Math.random() * 21))
    i++
  }

})();


