const db = require("../config/db");
const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const query = util.promisify(db.query).bind(db);
const FileService = {
  searchFile: async searchKey => {
    let file = await query("SELECT * FROM file WHERE fileName = ?", [
      searchKey
    ]);
    if (file) {
      return "file found";
    } else {
      return "File Not Found";
    }
  },
  addFile: async (folderID, fileData, fileName) => {
    const dirPath = path.join(process.env.PROJECT_HOME, `${folderID}`);
    try {
      await FileService.writeFile(dirPath, fileName, fileData);
      const result = await query(
        `INSERT INTO file 
        (fileName, folderID, filePath) 
        VALUES 
        (?, ?, ?)`,
        [fileName, folderID, dirPath]
      );

      let message = "Error in creating folder";
      if (result.affectedRows) {
        message = " created successfully";
      }
      return { message };
    } catch (err) {
      console.log("failed to add files ");
    }
  },

  writeFile: async (dirPath, fileName, file) => {
    const exists = await fs.pathExists(dirPath);
    let fullPath = path.join(dirPath, fileName);
    if (exists) {
      await fs.writeFile(fullPath, file);
    } else {
      await fs.mkdirp(dirPath);
      await fs.writeFile(fullPath, file);
    }
  }
};

module.exports = FileService;
