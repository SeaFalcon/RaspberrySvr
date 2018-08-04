const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get("/notice", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
  })
  console.log(`Listening on ${port} Port...`);
});

// netstat -tnlp
// kill -9 pid
