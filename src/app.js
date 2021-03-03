const express = require("express");
require("dotenv").config();
const app = express();
const fileUpload = require("express-fileupload");
const folderService = require("./service/folder");
const fileService = require("./service/file");
app.use(fileUpload());
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.get("/addFolder", async (req, res) => {
  try {
    await folderService.addFolder(req.body.path);
    res.json({ message: "folder added successfully" });
  } catch (err) {
    res.json({ message: " failed to folder " });
  }
});
app.delete("/deleteFolder/:folderID", async (req, res) => {
  try {
    await folderService.deleteFolder(req.params.folderID);
    res.json({ message: "Folder deleted successfully." });
  } catch (err) {
    res.json({ message: "Failed to delet folder" });
  }
});
app.get("/directory", async (req, res) => {
  try {
    const _data = await folderService.getDirectoryList();
    res.send(_data);
  } catch (err) {
    res.json({ message: "Failed to fetch data from Directory" });
  }
});
app.get("/searchFile/:searchKey", async (req, res) => {
  try {
    await fileService.searchFile(req.params.searchKey);
    res.json({ message: result });
  } catch (err) {
    res.json({ message: "File doesnot exist" });
  }
});
app.get("/searchFolder/:searchKey", async (req, res) => {
  try {
    const result = await folderService.searchFolder(req.params.searchKey);
    res.json({ message: result });
  } catch (err) {
    res.json({ message: "Folder doesnot exist" });
  }
});
app.get("/listfolderdetails/:folderID", async (req, res) => {
  try {
    const result = await folderService.getDirListByFolderID(
      req.params.folderID
    );
    res.send(result);
  } catch (err) {
    res.json("failed to load details ");
  }
});
app.post("/addFile", async (req, res) => {
  try {
    await fileService.addFile(
      req.body.folderID,
      req.files.FileData.data,
      req.files.FileData.name
    );
    res.json({ message: "file  uploaded successfully" });
  } catch (err) {
    res.json({ message: "failed to upload file" });
  }
});
app.post("/moveFolder", async (req, res) => {
  res.json({ message: "Not Implemented " });
});
app.post("/moveFile", async (req, res) => {
  res.json({ message: "Not Implemented " });
});
app.listen("3001", () => {
  console.log("Server started on port 3001");
});
