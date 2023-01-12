//-------------------------------------------------------------------------------------IMPORTS-------//
const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
var crypto = require("crypto");
const { Sequelize } = require("sequelize-cockroachdb");
const { faker } = require('@faker-js/faker');
faker.locale = "nl_BE"
//-----------------------------------------------------------------------------------REQUESTS-----//
app.use(express.static(__dirname + "/../client/build/"));
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/../client/build/index.html");
});
//------------------------------------------------------------------------------------SQL SERVER----//
settings = JSON.parse(fs.readFileSync("./server/settings.json"));
console.log(settings["url"]);

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
//--------------------------------------------------------------------------------------------------//

(async () => {
  console.log("Starting")
  i = 0
  while (i < 20) {
    await addUserWithPass(faker.name.firstName(), faker.name.lastName(), faker.random.alphaNumeric(10), false, "0")
    i++
  }
  await sequelize.close();
})();

