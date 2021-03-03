const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "filefoldermanagement"
});
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql DB Connected");
});

module.exports = db;
