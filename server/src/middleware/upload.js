const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { uploadDir } = require("../config/env");

const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
const MAX_SIZE_MB = 5;

/**
 * Accepts one optional image in `fieldName` and saves it to uploads/<folder>.
 * The saved public path ends up in req.uploadedPath, e.g. "/uploads/books/abc.jpg".
 */
function imageUpload(folder, fieldName) {
  const target = path.join(uploadDir, folder);
  fs.mkdirSync(target, { recursive: true });

  const upload = multer({
    storage: multer.diskStorage({
      destination: target,
      // Random name: avoids clashes and keeps user input out of the file system.
      filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomUUID()}${ALLOWED[file.mimetype]}`),
    }),
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (ALLOWED[file.mimetype]) return cb(null, true);
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", fieldName));
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) {
        if (req.file) req.uploadedPath = `/uploads/${folder}/${req.file.filename}`;
        return next();
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: `Image is too big. The limit is ${MAX_SIZE_MB} MB.` });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Use a JPG, PNG or WEBP image." });
      }
      return res.status(400).json({ message: err.message });
    });
  };
}

/** Delete a previously uploaded file. Quietly ignores files that are already gone. */
function removeUpload(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const file = path.join(uploadDir, publicPath.replace("/uploads/", ""));
  fs.promises.unlink(file).catch(() => {});
}

module.exports = { imageUpload, removeUpload };
