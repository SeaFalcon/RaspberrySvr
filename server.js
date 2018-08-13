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

// 루트
app.post("/fileList", (req, res) => {
  var dir = req.body.path;
  var fileList = [];
  try {
    var files = fs.readdirSync(dir);
  } catch (err) {
    res.json({ 'err': err });
  }

  files.forEach((file, i, arr) => {
    try {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        try {
          fs.readdirSync(path.join(dir, file));
        } catch (err) {
          fileList.push({ name: file, isDirectory: true, permission: false });
          return;
        }
        fileList.push({ name: file, isDirectory: true, permission: true });
      } else {
        try {
          fs.readdirSync(path.join(dir, file));
        } catch (err) {
          if (err.errno === -13) {
            fileList.push({ name: file, isDirectory: false, permission: false });
            return;
          }
        }
        fileList.push({ name: file, isDirectory: false, permission: true });
      }
    } catch (err) { }
  });
  res.json(fileList);
});


// 폴더
app.post("/mkdir", (req, res) => {
  var name = req.body.dirName;
  fs.mkdir(path.join(name), err => {
    if (err) {
      res.json({ result: err });
    } else {
      res.json({ result: 'mkdir ${name} SUCCESS' });
    }
  });
});

app.post("/moveFolder", (req, res) => {
  var params = req.body;
});

app.post("/copyFolder", (req, res) => {
  var params = req.body;
});

app.post("/rmdir", (req, res) => {
  var success = [];
  var errList = [];
  var p = req.body.path;
  var dirList = req.body.dirList;

  dirList.forEach(dir => {
    try {
      fs.rmdirSync(path.join(p, dir));
      success.push(`${dir} 폴더 삭제 성공!`);
    } catch (err) {
      if(err.errno === -39){
        fs.readdirSync(path.join(p, dir)).forEach(file => {
          try {
            file.unlinkSync(path.join(p, dir, file));
            success.push(`${path.join(p, dir)} 폴더 내 ${file} 삭제 성공! `)
          } catch(err){
            errList.push(err);
          }
        });
        // 폴더 내 파일 삭제 후 폴더 삭제 시도
        try{
          fs.rmdirSync(path.join(p, dir));
          success.push(`${dir} 폴더 삭제 성공!`);
        } catch (err) {
          errList.push(err);
        }
      }
      errList.push(err);
    }
  });

  res.json({
    success: success,
    err: errList
  });
});

// 파일
app.post('/touch', (req, res) => {
  /*
    'r' - Open file for reading. An exception occurs if the file does not exist.
    'r+' - Open file for reading and writing. An exception occurs if the file does not exist.
    'rs+' - Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
    'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
    'wx' - Like 'w' but fails if path exists.
    'w+' - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
    'wx+' - Like 'w+' but fails if path exists.
    'a' - Open file for appending. The file is created if it does not exist.
    'ax' - Like 'a' but fails if path exists.
    'a+' - Open file for reading and appending. The file is created if it does not exist.
    'ax+' - Like 'a+' but fails if path exists.
  */
  var name = req.body.fileName;

  try {
    fs.openSync(path.join(name), 'wx');
    res.json("생성성공");
  } catch (err) {
    res.json(err);
  }
})

app.post("/showFile", (req, res) => {
  var params = req.body;
});

app.post("/moveFile", (req, res) => {
  var params = req.body;
});

app.post("/copyFile", (req, res) => {
  var params = req.body;
});

app.post("/unlinkFile", (req, res) => {
  var success = [];
  var errList = [];
  var p = req.body.path;
  var fileList = req.body.fileList;

  fileList.forEach(file => {
    try {
      fs.unlinkSync(path.join(p, file));
      success.push(`${file} 파일 삭제 성공!`);
    } catch (err) {
      errList.push(err);
    }
  });

  res.json({
    success: success,
    err: errList
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
    release: os.release()      // 운영체제 버전
  });
});

app.listen(PORT, () => {
  require("dns").lookup(require("os").hostname(), function (err, add, fam) {
    console.log("addr: " + add);
  });
  console.log(`Listening on ${PORT} Port...`);
});

// netstat -tnlp
// kill -9 pid
