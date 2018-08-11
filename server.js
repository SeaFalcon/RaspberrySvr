const path = require("path");
const fs = require("fs");
const os = require("os");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = os.hostname() == 'DEV-05-PC' ? 30000 : 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/notice", (req, res) => {
  // res.sendFile(__dirname + '/public/index.html');
});

// 루트
app.post("/fileList", (req, res) => {
  var dir = req.body.path;
  var fileList = [];
  try{
    var files = fs.readdirSync(dir);
  }catch(err){
    res.json({'err': err});
  }

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

app.post("/osInfo", (req, res) => {
  res.json({
    tmpdir: os.tmpdir(),       // 임시 저장 폴더의 위치
    endianness: os.endianness(),   // CPU의 endianness(BE 또는 LE)
    hostname: os.hostname(),     // 호스트 이름(컴퓨터 이름)
    type: os.type(),         // 운영체제 이름
    platform: os.platform(),     // 운영체제 플랫폼
    arch: os.arch(),         // 운영체제 아키텍처
    release: os.release(),      // 운영체제 버전
  })
})

app.listen(PORT, () => {
  require("dns").lookup(require("os").hostname(), function (err, add, fam) {
    console.log("addr: " + add);
  });
  console.log(`Listening on ${PORT} Port...`);
});

// netstat -tnlp
// kill -9 pid
