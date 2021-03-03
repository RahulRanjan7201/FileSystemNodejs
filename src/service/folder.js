const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const fs = require("fs-extra");
const pathSys = require("path");
const FolderService = {
  searchFolder: async searchKey => {
    let folder = await query("SELECT * FROM folder WHERE folderName = ?", [
      searchKey
    ]);
    if (folder) {
      return "folder found";
    } else {
      throw "Folder not found!";
    }
  },
  getDirListByFolderID: async folderID => {
    const details = { folder: {}, files: {} };
    let folders = await query(
      "SELECT * FROM folder WHERE folderName   =? OR parentFolderID=?",
      [folderID, folderID]
    );
    details.folder = folders;
    const folderIds = folders.map(folder => {
      return folder.folderName;
    });
    let files = await query("SELECT * FROM file WHERE folderID IN   (?)", [
      folderIds
    ]);
    details.files = files;
    return details;
  },
  getDirectoryList: async () => {
    let folders = await query("SELECT * FROM folder");
    let files = await query("SELECT * FROM file");
    const foldersMap = folders.reduce((acc, folder) => {
      if (!folder.parentFolderID) {
        folder.parentFolderID = undefined;
      }
      acc[folder.parentFolderID] = folder;
      folder.children = [];
      return acc;
    }, {});
    const fileMaps = files.reduce((acc, file) => {
      acc[file.fileName] = file;
      return acc;
    }, {});
    files.forEach(file => {
      const parentId = file.folderID;
      if (parentId) {
        if (foldersMap[parentId]) {
          foldersMap[parentId].children = foldersMap[parentId].children || [];
          foldersMap[parentId].children.push(fileMaps[file.fileName]);
        }
      }
    });
    return Object.values(foldersMap);
  },
  deleteFolder: async folderId => {
    const dirPath = pathSys.join(process.env.PROJECT_HOME, `${folderId}`);
    const exists = await fs.pathExists(dirPath);
    if (!exists) {
      return;
    }
    await fs.remove(dirPath);
    await query("DELETE FROM file WHERE folderID = ?", [folderId]);
    await query("DELETE FROM folder WHERE parentFolderID = ?", [folderId]);
    await query("DELETE FROM folder WHERE folderName = ?", [folderId]);
  },
  addFolder: async path => {
    //Todo: ParentFolder Check is missing
    const validFolderName = FolderService.checkFolderNameIsValid(path);
    if (!validFolderName) {
      throw "Invalid Folder Name";
    } else {
      let parentFolderID = await FolderService.getParentFolderIDByPath(path);
      let folderName = await FolderService.getFolderNameFromPath(path);
      const dirPath = pathSys.join(process.env.PROJECT_HOME, `${path}`);
      const result = await query(
        `INSERT INTO folder 
        (virtualPath, parentFolderID, folderName) 
        VALUES 
        (?, ?, ?)`,
        [path, parentFolderID, folderName]
      );
      await FolderService.createFolder(dirPath);
      let message = "Error in creating folder";
      if (result.affectedRows) {
        message = " created successfully";
      }
      return { message };
    }
  },
  createFolder: async dirPath => {
    const exists = await fs.pathExists(dirPath);
    if (!exists) {
      await fs.mkdirp(dirPath);
    }
  },
  getFolderNameFromPath: async virtualPath => {
    let virtualPathArray = virtualPath.split("/");
    return virtualPathArray[virtualPathArray.length - 1] || "";
  },
  getParentFolderIDByPath: path => {
    let virtualPathArray = path.split("/");
    virtualPathArray.pop();
    let parentFolderPath = virtualPathArray.join("/");
    return FolderService.getFolderIDByPath(parentFolderPath);
  },
  getFolderIDByPath: async queryPath => {
    let folder = await query("SELECT * FROM folder WHERE virtualPath = ?", [
      queryPath
    ]);
    return folder ? queryPath : null;
  },
  checkFolderNameIsValid: path => {
    if (!path.trim()) {
      return false;
    } else {
      return true;
    }
  }
};

module.exports = FolderService;
