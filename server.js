'use strict';

var express = require('express');
var cors = require('cors');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 },
  onError: (err, next) => {
    console.log(err);
    next(err);
  }
});

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  const file = req.file;
  if (file) {
    res.status(200).json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });
  } else {
    res.status(400).json({
      msg: "You must provide a file!"
    });
  }
});

//error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err.message);
    res.status(400).json({
      msg: err.message
    });
  }else{
   next();
  }
});

app.use((req, res) => {
  res.status(404).json({
    msg: "Page not found!"
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
