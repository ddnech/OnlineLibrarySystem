const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const static = path.join(__dirname, "..", "..", "..","src", "public", "imgGenre");
    cb(null, static);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const filename = file.originalname;
    cb(null, `${timestamp}-${filename}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    console.log("kena ini");
    cb(null, true);
  } else {
    console.log(file.mimetype);
    req.fileValidationError = "File type not supported";
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file format"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1000 * 1000,
  },
  fileFilter: imageFilter,
});

module.exports = handleImageGenreUpload = (req, res, next) => {
  upload.single("imgGenre")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).send({ error: "File size exceeded the limit" });
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          res
            .status(400)
            .send({ error: "Unsupported format. Use: JPEG, PNG, JPG." });
        }
      } else {
        res.status(400).send({ error: err.message });
      }
    } else {
      next();
    }
  });
};
