const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get("/notice", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(22, () => {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
  })
  console.log("Listening on 8888 Port...");
});
