// For file upload method we export upload() function that:
// 	Uses middleware function for the upload
// 	catch multer error (in middleware functioni)
//
// For File Information and Download:
//	getListFiles(): read all files in uploads folder, return list of files’ information (name, url)
//	download(): receives file name as input parameter, then uses Express res.download API to
//	            transfer the file at path (directory + file name) as an ‘attachment’.
//
// We call middleware function uploadFile() first.
// If the HTTP request doesn’t include a file, send 400 status in the response.
// We also catch the error and send 500 status with error message.


const uploadFile = require("../middleware/upload");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
	    message: "File size cannot be larger that 2MB",
	});
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};
