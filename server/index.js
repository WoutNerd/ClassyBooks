//-------------------------------------------------------------------------------------IMPORTS-------//
const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
var crypto = require("crypto");
const { Sequelize } = require("sequelize-cockroachdb");

//-------------------------------------------------------------------------------------REQUESTS-----//
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
  } finally {
    await sequelize.close();
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

function addUserWithPass(name, surname, password, privileged, materials) {
  console.log("a");
  let privilegedBit = 0;
  if (privileged) {
    privilegedBit = 1;
  }
  let hashes = generateHashes(name, surname, password);
  req = new Request(
    `INSERT INTO USERS VALUES(${name}, ${surname}, ${privilegedBit}, ${hashes[0]}, ${hashes[1]}, '')`,
    (err) => {
      console.log(err);
    }
  );
  connection.execSql(req);
  req.on("requestCompeleted", () => {
    console.log("Request completed");
  });
}
//--------------------------------------------------------------------------------------------------//
(async () => {
  const a = await request("SELECT * FROM USERS");
  console.log(a[0]);
})();
