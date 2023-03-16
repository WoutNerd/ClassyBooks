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

const leesniveaus = ["AVI-START", "AVI-M3", "AVI-E3", "AVI-M4", "AVI-E4", "AVI-M5", "AVI-E5", "AVI-M6", "AVI-E6", "AVI-M7", "AVI-E7", "AVI-PLUS"]
const classes = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"]
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
      user = await login(req["body"]["name"], req["body"]["surname"], req["body"]["sha256"], req["body"]["md5"])
      sessionid = user[0]
      userid = user[1]
      privilege = user[2]
      if (sessionid == "Invalid credentials") { res.status(400).send(sessionid) }
      else { res.status(200).send({ "sessionid": sessionid, "userid": userid, "privilege": privilege }) }
    }
    else { res.status(400).send("Invalid credentials") }

  })();
})
app.post("/getUser", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      session = await getSession(req["body"]["sessionid"])
      user = await request(`SELECT * FROM USERS WHERE USERID='${req["body"]["userid"]}'`)
      if (hasData(user)) {
        if (session['privilege'] == '1') { res.status(200).send(stripInfo(user[0], ["md5", "sha256", "sessionid", "sessionidexpire"])) }
        else { res.status(200).send(stripInfo(user[0], ["privilege", "sha256", "md5", "materials", "sessionid", "sessionidexpire"])) }
      }
      else res.status(400).send("Invalid user")
    }
    else res.status(400).send("Invalid request")
  })();
})
app.post("/createUser", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      session = await getSession(req["body"]["sessionid"])
      if (session['privilege'] == '1') {
        await addUserWithHash(req["body"]["name"], req["body"]["surname"], req["body"]["privilege"], req["body"]["sha256"], req["body"]["md5"], [])
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
      if (hasData(material)) {
        if (session['privilege'] == '1') { res.status(200).send(material[0]) }
        else { res.status(200).send(stripInfo(material[0], ["lendoutto", "returndate", "available"])) }
      }
      else res.status(400).send("Invalid material")
    }
  })();
})
app.post("/createMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      session = await getSession(req["body"]["sessionid"])
      if (session['privilege'] == '1') {
        await addMaterial(req["body"]["title"], req["body"]["place"], JSON.stringify(req["body"]["description"]), req["body"]["available"])
        res.setHeader('Content-Type', 'text/plain'); res.status(200).send("Successfully added material")
      }
      else { res.status(400).send("Invalid session") }
    }
    else { res.status(400).send("Invalid request") }
  })();
})
app.post("/lendMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      let lend = await lendMaterial(req["body"]["userid"], req["body"]["materialid"])
      if (lend[0]) {
        res.setHeader('Content-Type', 'text/plain')
        res.status(200).send(lend[1])
      }
      else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") }
    }
    else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") }
  })();
})
app.post("/returnMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      let ret = await returnMaterial(req["body"]["materialid"])
      if (ret) {
        res.setHeader('Content-Type', 'text/plain')
        res.status(200).send("Successfully returned material")
      }
      else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") }
    }
  })();
})
app.post("/allMaterials", (req, res) => {
  (async () => {
    books = await request("SELECT MATERIALID, TITLE, PLACE, DESCR FROM MATERIALS")
    res.setHeader("Content-Type", "application/json")
    res.status(200).send(books)
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

function hasData(dbres) {
  try {
    return dbres[1]["rowCount"] > 0
  }
  catch {
    return false
  }
}
function dateInPast(firstDate, secondDate) {
  return firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)
}

function checkSessionValidity(user) {
  if (user[0][0]["sessionid"] != null) {
    return getSession(user[0][0]["sessionid"]) != null
  }
  else return false

}

//----------------------------------------------------------------------------DATABASE-FUNCTIONS----//

async function addUserWithPass(name, surname, password, clsNum, cls, privilege, materials) {
  let hashes = generateHashes(name, surname, password);
  await addUserWithHash(name, surname, clsNum, cls, privilege, hashes[0], hashes[1], materials)
}

async function addUserWithHash(name, surname, clsNum, cls, privilege, sha256, md5, materials) {
  await request(`INSERT INTO USERS (firstname, lastname, class, classnum, privilege, sha256, md5, materials) VALUES ('${name}', '${surname}', '${cls}', '${clsNum}', '${privilege}', '${sha256}', '${md5}', '${JSON.stringify(materials)}');`);

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
      userid = d[0][i]["userid"]
      sessionId = uuidv4().toString()
      time = new Date().addHours(5)
      await request(`UPDATE USERS SET SESSIONID='${sessionId}', SESSIONIDEXPIRE='${time.toISOString()}' WHERE FIRSTNAME='${name}' AND LASTNAME='${surname}'`)
      sess = await getSession(sessionId)
      privilege = sess["privilege"]
    }
    i += 1
  }
  if (sessionId == "") {
    sessionId = "Invalid credentials"
    userid = ""
    privilege = 0
  }
  return [sessionId, userid, privilege]

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

async function lendMaterial(userid, materialid) {
  returndate = new Date().addHours(120).toISOString()
  material = await request(`SELECT * FROM MATERIALS WHERE MATERIALID='${materialid}'`)
  user = await request(`SELECT * FROM USERS WHERE USERID='${userid}'`)
  if (hasData(material) > 0 && material[0][0]["available"] == '1' && hasData(user) && checkSessionValidity(user)) {
    user[0][0]["materials"].push(materialid)
    await request(`UPDATE MATERIALS SET LENDOUTTO='${userid}', RETURNDATE='${returndate}', AVAILABLE='0' WHERE MATERIALID='${materialid}'`)
    await request(`UPDATE USERS SET MATERIALS='${JSON.stringify(user[0][0]["materials"])}' WHERE USERID='${userid}'`)
    return [true, returndate]
  }
  else { return false }

}
async function returnMaterial(materialid) {

  now = new Date()
  material = await request(`SELECT * FROM MATERIALS WHERE MATERIALID='${materialid}'`)
  if (hasData(material)) {
    user = await request(`SELECT * FROM USERS WHERE USERID='${material[0][0]['lendoutto']}'`)
    if (hasData(user) && checkSessionValidity(user)) {
      await request(`UPDATE MATERIALS SET LENDOUTTO=NULL, RETURNDATE=NULL, AVAILABLE='1' WHERE MATERIALID='${materialid}'`)
      user[0][0]["materials"].splice(user[0][0]["materials"].indexOf(materialid), 1)
      returnDate = new Date(material[0][0]["returndate"])
      if (dateInPast(returnDate, now)) { user[0][0]["howmuchlate"] += 1 }
      await request(`UPDATE USERS SET MATERIALS='${JSON.stringify(user[0][0]["materials"])}', HOWMUCHLATE=${user[0][0]["howmuchlate"]} WHERE USERID='${material[0][0]['lendoutto']}'`)
      return true
    }
    else return false
  }
  else return false
}

//--------------------------------------------------------------------------------------------------//

(async () => {
  console.log("Starting")
  await sequelize.authenticate()
  // i = 0
  // while (i < 20) {
  //   let leesniveau = leesniveaus[Math.floor(Math.random() * leesniveaus.length)]
  //   let cls = classes[Math.floor(Math.random() * classes.length)]
  //   await addUserWithPass(faker.name.firstName(), faker.name.lastName(), "password", Math.floor(Math.random() * 25) + 1, cls, 0, [])
  //   await addMaterial(faker.word.adjective() + " " + faker.word.noun(), leesniveau, JSON.stringify({ "author": faker.name.fullName(), "pages": Math.floor(Math.random() * 200) + 10, "cover": faker.image.abstract(1080, 1620), "readinglevel": leesniveau }), true)
  //   i++
  // }
})();
