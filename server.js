const path = require("path");
const fs = require("fs");
const os = require("os");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(os.tmpdir());       // 임시 저장 폴더의 위치
console.log(os.endianness());   // CPU의 endianness(BE 또는 LE)
console.log(os.hostname());     // 호스트 이름(컴퓨터 이름)
console.log(os.type());         // 운영체제 이름
console.log(os.platform());     // 운영체제 플랫폼
console.log(os.arch());         // 운영체제 아키텍처
console.log(os.release());      // 운영체제 버전

app.get("/notice", (req, res) => {
  // res.sendFile(__dirname + '/public/index.html');
});

// 루트
app.get("/fileList", (req, res) => {
  var fileList = [];
  var files = fs.readdirSync("/");
  files.forEach((file, i, arr) => {
    fs.stat(`/${file}`, (err, stats) => {
      if (err === null) {
        if (stats.isDirectory()) {
          fileList.push({ fileName: file, isDirectory: true });
        } else {
          fileList.push({ fileName: file, isDirectory: false });
        }
      }
      if (i === arr.length - 1) {
        res.json(fileList);
      }
    });
  });
});

app.post("/fileList", (req, res) => {
  var dir = req.body.path;

  if("win32".slice(0,3) !== 'win'){
    dir = '/'
  }

  var fileList = [];
  var files = fs.readdirSync(dir);

  files.forEach((file, i, arr) => {
    try {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        fileList.push({ fileName: file, isDirectory: true });
      } else {
        fileList.push({ fileName: file, isDirectory: false });
      }
    } catch (err) {}
  });
  res.json(fileList);
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
  var params = req.body.path;

  var dir = fs.readdirSync(params);
  dir.forEach(d => {
    fs.unlinkSync(path.join(params, d));
  });
  fs.rmdirSync(params);


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
