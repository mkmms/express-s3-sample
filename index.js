require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');

var accessKeyId = process.env.AWS_ACCESS_KEY || "xxxxxx";
var secretAccessKey = process.env.AWS_SECRET_KEY || "+xxxxxx+B+xxxxxxx";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

var app = express();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', "views")

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));


// parse application/json
app.use(bodyParser.json());

app.get("/", function(req, res){
  res.render("form")
})

app.post("/upload", upload.single('image'), function(req, res, next) {
  res.send('Successfully uploaded ' + req.file + ' files!')
})

app.post("/uploads", upload.array('images'), function (req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
})

app.listen(5005, function(){
  console.log("server started at 5005");
})