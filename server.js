const path = require("path");
const fs = require("fs");
const os = require("os");
const rimraf = require('rimraf');
const ncp = require('ncp').ncp;
ncp.limit = 16;
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
  // fs.mkdir(path.join(name), err => {
  //   if (err) {
  //     res.json({ result: err });
  //   } else {
  //     res.json({ result: `mkdir ${name} SUCCESS` });
  //   }
  // });
  try {
    fs.mkdirSync(path.join(name))
    res.json({ result: `mkdir ${name} SUCCESS` });
  } catch (err) {
    res.json({ result: err });
  }
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
      //console.log(err.code);
      errList.push(err);
      if (err.code === "ENOTEMPTY") {
        fs.readdirSync(path.join(p, dir)).forEach(file => {
          try {
            fs.unlinkSync(path.join(p, dir, file));
            success.push(`${path.join(p, dir)} 폴더 내 ${file} 삭제 성공! `)
          } catch (err) {
            console.log(err.code);
            errList.push(err);
          }
        });

        // 폴더 내 파일 삭제 후 폴더 삭제 시도
        if (fs.readdirSync(path.join(p, dir)).length === 0) {
          try {
            fs.rmdirSync(path.join(p, dir));
            success.push(`${dir} 폴더 삭제 성공!`);
          } catch (err) {
            console.log(err.code);
            errList.push(err);
          }
        }
      } else {
        errList.push(err);
      }
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

  // fs.open(path.join(name), 'wx', (err, fd) => {
  //   if(err)
  //     res.json(err);
  //   res.json("생성 성공!");
  // })

})

app.post("/showFile", (req, res) => {
  var params = req.body;
});

app.post("/move", (req, res) => {
  console.log(req.body);
  var p = req.body.path;
  var fileList = req.body.sources;
  var dest = path.join(req.body.destination);

  fileList.forEach(file => {
    console.log(path.join(p, file), dest);
    ncp(path.join(p, file), dest, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('done!');
    });
  });
});

app.post("/copy", (req, res) => {
  var p = req.body.path;
  var fileList = req.body.sources;
  var dest = path.join(req.body.destination);

  fileList.forEach(file => {
    ncp(path.join(p, fileList), dest, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('done!');
    });
  });

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

// 파일, 폴더 삭제 통합
app.post('/remove', (req, res) => {
  var result = {
    success: [],
    errList: []
  };
  var p = req.body.path;
  var list = req.body.name;
  console.log(p, list);

  list.forEach(l => {
    // rimraf(path.join(p, l), result);
    rimraf(path.join(p, l), { maxBusyTries: 100 }, err => {
      console.log(err);
    });
  });

  res.json(result);
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

// function rimraf(p, result) {
//   console.log(p, result);
//   try {
//     var dir = fs.readdirSync(p);
//     dir.forEach(d => {
//       console.log(p, result, d);
//       rimraf(path.join(p, d), result);
//       try{
//         fs.accessSync(path.join(p, d), fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK)
//         console.log("접근가능");
//       }catch(err){
//         console.log(err);
//       }

//     })
//     console.log(fs.readdirSync(p));
//     setTimeout(() => {
//       console.log("waiting 1000ms...")  
//       fs.rmdirSync(p);
//     }, 1000);    

//     //fs.rmdirSync(p);
//     console.log(`${p} 폴더를 삭제했습니다.`);
//     result.success.push(`${p} 폴더를 삭제했습니다.`);
//   } catch (e) {
//     console.log(e);
//     fs.unlinkSync(p);
//     console.log(`${p} 파일을 삭제했습니다.`);
//     result.success.push(`${p} 파일을 삭제했습니다.`);
//   }
// }

// netstat -tnlp
// kill -9 pid
