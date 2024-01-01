require("dotenv").config();
const mysql = require("mysql2");
const HOST=process.env.HOST;
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "uk",
});

connection.getConnection((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("connected successfully");
});

module.exports = connection.promise();