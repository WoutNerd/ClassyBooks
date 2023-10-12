//-------------------------------------------------------------------------------------IMPORTS-------//
require('dotenv').config()
const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 8080;
const app = express();
var crypto = require("crypto");
const { Sequelize } = require("sequelize-cockroachdb");
const { faker } = require('@faker-js/faker/locale/nl_BE');
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

const leesniveaus = ["AVI-START", "AVI-M3", "AVI-E3", "AVI-M4", "AVI-E4", "AVI-M5", "AVI-E5", "AVI-M6", "AVI-E6", "AVI-M7", "AVI-E7", "AVI-PLUS"]
const classes = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"]
//-----------------------------------------------------------------------------------REQUESTS-------//

// Deploy express app
app.use(express.static(__dirname + "/../client/build/"));
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/../client/build/index.html");
});

//-------------------------------------------------------------------------------API-REQUESTS-------//
app.post("/loginTeacher", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      // Try login
      user = await login(req["body"]["name"], req["body"]["surname"], req["body"]["sha256"], req["body"]["md5"])
      sessionid = user[0]
      userid = user[1]
      privilege = user[2]
      if (sessionid == "Invalid credentials") { res.status(400).send(sessionid) } //Invalid credentials
      else { res.status(200).send({ "sessionid": sessionid, "userid": userid, "privilege": privilege }) } //Successfully logged in
    }
    else { res.status(400).send("Invalid credentials") } //Invalid credentials

  })();
})
app.post("/loginPupil", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      // Get user from server based on class and number
      let userReq = await request(`SELECT FIRSTNAME, LASTNAME FROM USERS WHERE CLASS='${req["body"]["clss"]}' AND CLASSNUM=${req["body"]["number"]};`)
      // Try login
      user = await login(userReq[0][0]["firstname"], userReq[0][0]["lastname"], req["body"]["sha256"], req["body"]["md5"])
      sessionid = user[0]
      userid = user[1]
      privilege = user[2]
      if (sessionid == "Invalid credentials") { res.status(400).send(sessionid) } // Invalid credentials
      else { res.status(200).send({ "sessionid": sessionid, "userid": userid, "privilege": privilege }) } //Successfully logged in
    }
    else { res.status(400).send("Invalid credentials") } // Invalid credentials

  })();
})
app.post("/getUser", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      // Get admin's session and requested user's details
      session = await getSession(req["body"]["sessionid"])
      if (session != null) {
        user = await request(`SELECT * FROM USERS WHERE USERID='${req["body"]["userid"]}'`)
        // If requested user is real
        if (hasData(user)) {
          sessionPrivilege = parseInt(session["privilege"])
          if (sessionPrivilege >= 1) { res.status(200).send(stripInfo(user[0], ["md5", "sha256", "sessionid", "sessionidexpire"])) } // If admin has privilege, send user details
          else { res.status(200).send(stripInfo(user[0], ["privilege", "sha256", "md5", "materials", "sessionid", "sessionidexpire"])) } //If admin is not privileged, send user other user details
        }
        else res.status(400).send("Invalid user")
      }
      else res.status(400).send("Invalid user") // Requested user is not real
    }
    else res.status(400).send("Invalid request") // Request is invalid
  })();
})
app.post("/createUser", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      session = await getSession(req["body"]["sessionid"]) // Get admin session

      if (session['privilege'] == '2') {
        // Create admin (lvl 1)
        if (parseInt(req["body"]["privilege"]) >= 1) {
          await addTeacherWithHash(req["body"]["name"], req["body"]["surname"], req["body"]["privilege"], req["body"]["sha256"], req["body"]["md5"], [])
          res.setHeader('content-type', 'text/plain'); res.status(200).send("Successfully added user")
        }
        // Create pupil
        else {
          await addPupilWithHash(req["body"]["name"], req["body"]["surname"], req["body"]["classNum"], req["body"]["cls"], req["body"]["privilege"], req["body"]["sha256"], req["body"]["md5"], [])
          res.setHeader('content-type', 'text/plain'); res.status(200).send("Successfully added user")
        }

      }
      else { res.status(400).send("Invalid session") } // Admin is not privileged to create user
    }
    else { res.status(400).send("Invalid request") } // Request is invalid

  })();
})
app.post("/getMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      // Get user session
      session = await getSession(req["body"]["sessionid"])

      // Get material details
      material = await request(`SELECT * FROM MATERIALS WHERE MATERIALID='${req["body"]["materialid"]}'`)

      // If material is real
      if (hasData(material)) {
        if (parseInt(session['privilege']) >= 1) { res.status(200).send(material[0]) } // If user is privileged, send material details
        else { res.status(200).send(stripInfo(material[0], ["lendoutto", "returndate", "lendcount"])) } // If user isn't privileged, strip info
      }
      else res.status(400).send("Invalid material") // Invalid material
    }
  })();
})
app.post("/createMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      // Get user session
      session = await getSession(req["body"]["sessionid"])
      // If user is privileged (lvl 2), create material
      if (session['privilege'] == '2') {
        await addMaterial(req["body"]["title"], req["body"]["place"], JSON.stringify(req["body"]["description"]), req["body"]["available"])
        res.setHeader('Content-Type', 'text/plain'); res.status(200).send("Successfully added material")
      }
      else { res.status(400).send("Invalid session") } // User is not privileged
    }
    else { res.status(400).send("Invalid request") } // Invalid request
  })();
})
app.post("/lendMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      // Call lend function
      let lend = await lendMaterial(req["body"]["userid"], req["body"]["materialid"])

      // If lend is valid, give returndate
      if (lend[0]) {
        res.setHeader('Content-Type', 'text/plain')
        res.status(200).send(lend[1])
      }
      else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") } // Lend is invalid
    }
    else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") } // Request is invalid
  })();
})
app.post("/returnMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      let ret = await returnMaterial(req["body"]["materialid"], req["body"]["score"])

      // Is return valid
      if (ret) {
        // Successful return
        res.setHeader('Content-Type', 'text/plain')
        res.status(200).send("Successfully returned material")
      }
      else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") } // Invalid return
    }
    else { res.setHeader('Content-Type', 'text/plain'); res.status(400).send("Invalid request") } // Invalid request
  })();
})
app.post("/allMaterials", (req, res) => {
  (async () => {
    // Send all materials (not all details)
    materials = await request("SELECT MATERIALID, TITLE, PLACE, DESCR, AVGSCORE FROM MATERIALS")
    res.setHeader("Content-Type", "application/json")
    res.status(200).send(materials[0])
  })();
})
app.post("/allUsers", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      sess = await getSession(req["body"]["sessionId"])
      if (sess != null) {
        // If admin is privileged
        if (parseInt(sess["privilege"]) >= 1) {
          users = await request("SELECT USERID, FIRSTNAME, LASTNAME, MATERIALS, CLASS, CLASSNUM FROM USERS")
          res.setHeader("Content-Type", "application/json")
          res.status(200).send(users[0])
        } else { res.status(400).send("Invalid request") } // Admin is not privileged
      }
    }
    else { res.status(400).send("Invalid request") } // Invalid request
  })();
})
app.post("/removeUser", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      sess = await getSession(req["body"]["sessionId"])
      // If admin is privileged (lvl 2)
      if (parseInt(sess["privilege"]) == 2) {
        await request(`DELETE FROM USERS WHERE USERID='${req["body"]["userId"]}'`)
        res.status(200).send("Successfully removed user")
        //Successful removal
      }
      else {
        res.status(403).send("Invalid request") // Unprivileged
      }
    }
    else { res.status(400).send("Invalid request") } // Invalid request
  })();
})
app.post("/removeMaterial", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      sess = await getSession(req["body"]["sessionId"])
      // If admin is privileged (lvl 2)
      if (parseInt(sess["privilege"]) == 2) {
        await request(`DELETE FROM MATERIALS WHERE MATERIALID='${req["body"]["materialId"]}'`)
        res.status(200).send("Successfully removed material")
        //Successful removal
      }
      else {
        res.status(403).send("Invalid request") // Unprivileged
      }
    }
    else { res.status(400).send("Invalid request") } // Invalid request
  })();
})
app.post("/changePassword", (req, res) => {
  (async () => {
    if (checkRequest(req)) {
      sess = await getSession(req["body"]["sessionId"])

      // If user is lvl 0 or 1, change own password
      if (parseInt(sess["privilege"]) <= 1) {
        // If current password is correct, change it to new
        if (sess["sha256"] == req["body"]["sha256"] && sess["md5"] == req["body"]["md5"]) {
          await request(`UPDATE USERS SET SHA256='${req["body"]["newSha256"]}' WHERE USERID='${sess["userid"]}'`)
          await request(`UPDATE USERS SET MD5='${req["body"]["newMd5"]}' WHERE USERID='${sess["userid"]}'`)
          res.status(200).send("Changed password")
        }
        else { res.status(400).send("Invalid credentials") } // Invalid credentials
      }
      // If user is lvl 2, change other user's password
      else if (parseInt(sess["privilege"]) == 2) {
        await request(`UPDATE USERS SET SHA256='${req["body"]["newSha256"]}' WHERE USERID='${req["body"]["userid"]}'`)
        await request(`UPDATE USERS SET MD5='${req["body"]["newMd5"]}' WHERE USERID='${req["body"]["userid"]}'`)
        res.status(200).send("Changed password")
      }
    }
    else { res.status(400).send("Invalid request") } // Invalid request
  })();
})
//------------------------------------------------------------------------------------SQL-----------//
//Initialise SQL-Client
try {
  settingsFile = fs.readFileSync("./server/settings.json")
  settings = JSON.parse(settingsFile);
}
catch { settings = { "url": process.env.DBURL }; }

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
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
//----------------------------------------------------------------------------DATABASE-FUNCTIONS-FOR-TESTING----//

async function addTeacherWithPass(name, surname, password, privilege, materials) {
  let hashes = generateHashes(name, surname, password);
  await addTeacherWithHash(name, surname, privilege, hashes[0], hashes[1], materials)
}
async function addPupilWithPass(name, surname, password, clsNum, clss, privilege, materials) {
  let hashes = generateHashes(clss, clsNum, password);
  await addPupilWithHash(name, surname, clsNum, clss, privilege, hashes[0], hashes[1], materials)
}
//----------------------------------------------------------------------------DATABASE-FUNCTIONS----//
async function addPupilWithHash(name, surname, clsNum, clss, privilege, sha256, md5, materials) {
  await request(`INSERT INTO USERS (firstname, lastname, class, classnum, privilege, sha256, md5, materials) VALUES ('${name}', '${surname}', '${clss}', '${clsNum}', '${privilege}', '${sha256}', '${md5}', '${JSON.stringify(materials)}');`);

}
async function addTeacherWithHash(name, surname, privilege, sha256, md5, materials) {
  await request(`INSERT INTO USERS (firstname, lastname, privilege, sha256, md5, materials) VALUES ('${name}', '${surname}', '${privilege}', '${sha256}', '${md5}', '${JSON.stringify(materials)}');`);

}
async function addMaterial(title, place, description, available) {

  let availableBit = 0;
  if (available) {
    availableBit = 1;
  }
  await request(`INSERT INTO MATERIALS (title, place, descr, available, lendcount, avgscore) VALUES ('${title}', '${place}', '${description}', '${availableBit}'), '0', '0.0'`);
}
async function login(name, surname, sha256, md5) {
  // Get trying user from database
  let d = await request(`SELECT * FROM USERS WHERE FIRSTNAME='${name}' AND LASTNAME='${surname}'`)
  let i = 0
  let sessionId = ""
  while (i < d[0].length) {
    let dbsha256 = d[0][i]["sha256"]
    let dbmd5 = d[0][i]["md5"]
    if (dbsha256 == sha256 && dbmd5 == md5) {
      //Correct credentials
      userid = d[0][i]["userid"]
      sessionId = uuidv4().toString() // Create sessionid
      time = new Date().addHours(5) // Create expiration time

      // Push to server
      await request(`UPDATE USERS SET SESSIONID='${sessionId}', SESSIONIDEXPIRE='${time.toISOString()}' WHERE FIRSTNAME='${name}' AND LASTNAME='${surname}'`)

      // Get session privilege
      sess = await getSession(sessionId)
      privilege = sess["privilege"]
    }
    i += 1
  }
  // Login invalid
  if (sessionId == "") {
    sessionId = "Invalid credentials"
    userid = ""
    privilege = 0
  }
  return [sessionId, userid, privilege]

}
async function getSession(sessionId) {
  // get user from db
  user = await request(`SELECT * FROM USERS WHERE SESSIONID='${sessionId}'`)
  // does user exist
  if (user[1]["rowCount"] > 0) {

    // Check expiration
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

  // Check if user and material are valid and available
  if (hasData(material) > 0 && material[0][0]["available"] == '1' && hasData(user) && checkSessionValidity(user)) {
    // Add material to user
    userMaterials = user[0][0]["materials"]
    userMaterials.push(materialid)

    // Push to db
    await request(`UPDATE MATERIALS SET LENDOUTTO='${userid}', RETURNDATE='${returndate}', AVAILABLE='0' WHERE MATERIALID='${materialid}'`)
    await request(`UPDATE USERS SET MATERIALS='${JSON.stringify(userMaterials)}' WHERE USERID='${userid}'`)

    // Return validity and returndate
    return [true, returndate]
  }
  else { return false } // User not valid or material not available

}
async function returnMaterial(materialid, score) {
  now = new Date()
  material = await request(`SELECT * FROM MATERIALS WHERE MATERIALID='${materialid}'`)

  // Check whether material is valid
  if (hasData(material)) {
    user = await request(`SELECT * FROM USERS WHERE USERID='${material[0][0]['lendoutto']}'`)
    // Check whether user is valid
    if (hasData(user) && checkSessionValidity(user)) {
      // Write material update to server with score
      await request(`UPDATE MATERIALS SET LENDOUTTO=NULL, RETURNDATE=NULL, AVAILABLE='1', AVGSCORE='${((material[0][0]["avgscore"] * material[0][0]["lendcount"]) + score / material[0][0]["lendcount"] + 1)}', LENDCOUNT='${material[0][0]["lendcount"] + 1}' WHERE MATERIALID='${materialid}'`)
      // Remove material from user
      userMaterials = user[0][0]["materials"]
      userMaterials.splice(userMaterials.indexOf(materialid), 1)

      // Check whether material is late
      returnDate = new Date(material[0][0]["returndate"])
      if (dateInPast(returnDate, now)) { user[0][0]["howmuchlate"] += 1 }

      // Push to db
      await request(`UPDATE USERS SET MATERIALS='${JSON.stringify(userMaterials)}', HOWMUCHLATE=${user[0][0]["howmuchlate"]} WHERE USERID='${material[0][0]['lendoutto']}'`)
      return true
    }
    else return false // User is invalid
  }
  else return false // Material is invalid
}
async function checkSessionExpireSweep() {
  let d = await request("SELECT SESSIONIDEXPIRE, SESSIONID FROM USERS")
  d[0].forEach(async element => {
    if (element["sessionid"] != null) {
      let time = element["sessionidexpire"]
      let now = new Date()
      if (Date.now() > time) {
        await request(`UPDATE USERS SET SESSIONID=NULL, SESSIONIDEXPIRE=NULL WHERE SESSIONID='${element['sessionid']}'`)
      }
    }
  });

}

//--------------------------------------------------------------------------------------------------//

(async () => {
  console.log("Starting")
  await sequelize.authenticate()
  // i = 0
  // while (i < 20) {
  //   let leesniveau = leesniveaus[Math.floor(Math.random() * leesniveaus.length)]
  //   let clss = classes[Math.floor(Math.random() * classes.length)]
  //   await addTeacherWithPass(faker.name.firstName(), faker.name.lastName(), "password", 1, [])
  //   await addPupilWithPass(faker.name.firstName(), faker.name.lastName(), "password", Math.floor(Math.random() * 25) + 1, clss, 0, [])
  //   await addMaterial(faker.word.adjective() + " " + faker.word.noun(), leesniveau, JSON.stringify({ "author": faker.name.fullName(), "pages": Math.floor(Math.random() * 200) + 10, "cover": faker.image.abstract(1080, 1620), "readinglevel": leesniveau }), true)
  //   i++
  // }
  setTimeout(() => checkSessionExpireSweep, 60000)
})();