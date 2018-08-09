const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 30000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/notice", (req, res) => {
  // res.sendFile(__dirname + '/public/index.html');
});

// 루트
app.get("/fileList", (req, res) => {
  var fileList = [];
  var files = fs.readdirSync('/');
  files.forEach((file, i, arr) => {
    fs.stat(`/${file}`, (err, stats) => {
      if(err === null){
        if(stats.isDirectory()){
          fileList.push({fileName: file, isDirectory: true});
        }else{
          fileList.push({fileName: file, isDirectory: false});
        }
      }
      if(i === arr.length-1) {
        //console.log(fileList);
        res.json(fileList);
      }
    });
  });
});

app.post("/fileList", (req, res) => {
  fs.access('c:\\', (err) => {
    console.log(err);
  })

  var dir = req.body.path;
  var fileList = [];
  var files = fs.readdirSync(dir);

  files.forEach((file, i, arr) => {
    fs.stat(path.join(dir, file), (err, stats) => {
      
      if(err === null){
        if(stats.isDirectory()){
          fileList.push({fileName: file, isDirectory: true});
        }else{
          fileList.push({fileName: file, isDirectory: false});
        }
      }
      if(i === arr.length-1) {
        //console.log(fileList);
        res.json(fileList);
      }
    });
  });
});

// 폴더
app.post("/showFolder", (req, res) => {
  var params = req.body;
  //fs.readdir() params.folder
});

app.post("/moveFolder", (req, res) => {
  var params = req.body;
});

app.post("/copyFolder", (req, res) => {
  var params = req.body;
});

app.post("/deleteFolder", (req, res) => {
  var params = req.body;
});

// 파일
app.post("/showFile", (req, res) => {
  var params = req.body;
});

app.post("/moveFile", (req, res) => {
  var params = req.body;
});

app.post("/copyFile", (req, res) => {
  var params = req.body;
});

app.post("/deleteFile", (req, res) => {
  var params = req.body;
});


app.listen(PORT, () => {
  require("dns").lookup(require("os").hostname(), function(err, add, fam) {
    console.log("addr: " + add);
  });
  console.log(`Listening on ${PORT} Port...`);
});

// netstat -tnlp
// kill -9 pid
