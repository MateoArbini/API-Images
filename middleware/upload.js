// First we import multer module
// Next we configure multer to use disk storage engine
//
// We have two options here: 
// - Destination: determines folder to store the uploaded files
// - Filename: determines the name of the file inside the destination folder
//
// util.promisfy(): makes the exported middleware object can be used with async-await
//
// Also here, we are restricting the size of the file up to 2MB

const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
