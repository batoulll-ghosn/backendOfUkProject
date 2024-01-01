require("dotenv").config();
const mysql = require("mysql2");
const HOST=process.env.HOST;
const USER=process.env.USER;
const PASS=process.env.PASS;
const DATABASE=process.env.DATABASE;
const connection = mysql.createPool({
  host: HOST,
  user:USER,
  password: PASS,
  database: DATABASE,
});

connection.getConnection((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("connected successfully");
});

module.exports = connection.promise();