const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.static(__dirname+"/../client/build/"));
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
app.get('*', (req, res) => {
    res.sendFile(__dirname+"/../client/build/index.html");
  });

function importData(json){
  let d = JSON.parse(json)
  let dtemp={"books": [], "accounts": []}
  for (let i=0;i<d["books"].length;i++){
    dtemp["books"].append(new Book(d["books"][i]["id"], d["books"][i]["title"], d["books"][i]["place"], d["books"][i]["description"], d["books"][i]["available"]))
  }
  for (let i=0;i<d["accounts"].length;i++){
    dtemp["accounts"].append(new Account(d["accounts"][i]["id"], d["accounts"][i]["name"], d["accounts"][i]["surname"], d["accounts"][i]["privileged"], d["accounts"][i]["sha256"], d["accounts"][i]["md5"], d["accounts"][i]["materials"]))
  }
  return dtemp
}
class Book{
  constructor(id, title, place, description, available){
    this.id=id
    this.title=title
    this.place=place
    this.description=description
    this.available=available
  }
  getJson(){
    return {"id": this.id, "title": this.title, "place": this.place, "description": this.description, "available": this.available}
  }
}
class Account{
  constructor(id, name, surname, privileged, sha256, md5, materials){
    this.id=id
    this.name=name
    this.surname=surname
    this.privileged=privileged
    this.sha256=sha256
    this.md5=md5
    this.materials=materials
  }
  getJson(){
    return {"id": this.id, "name": this.name, "surname": this.surname, "privileged": this.privileged, "sha256": this.sha256, "md5": this.md5, "materials":this.materials}
  }
}

function exportData(d){
  return JSON.stringify(d)
}