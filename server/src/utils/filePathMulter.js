const path = require("path");

module.exports = {
  convertDBPathToRealPath(dbPath) {
    return `${process.env.BASE_PATH}${dbPath}`;
  },
  
  createGenreImageDBPath(filename) {
    return `/src/public/imgGenre/${filename}`;
  },

  createBookImageDBPath(filename) {
    return `/src/public/imgBook/${filename}`;
  },

  extractFilenameFromDBPath(dbPath) {
    if (!dbPath || dbPath === "") {
      return "";
    }
    const pathSegments = dbPath.split("/");
    if (pathSegments.length < 5) {
      return "";
    }
    return pathSegments[4];
  },

  getAbsoluteGenreImagePath(filename) {
    return path.join(__dirname, "..", "..", "public", "imgGenre", filename);
  },

  getAbsoluteBookImagePath(filename) {
    return path.join(__dirname, "..", "..", "public", "imgBook", filename);
  },

};