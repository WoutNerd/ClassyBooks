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