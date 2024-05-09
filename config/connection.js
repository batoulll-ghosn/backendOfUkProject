require("dotenv").config();
const mysql = require("mysql2");
const HOST=process.env.HOST;
const USER=process.env.USER;
const PASS=process.env.PASS;
const DATABASE=process.env.DATABASE;
const connection = mysql.createPool({
  host: 'mysql-unt.alwaysdata.net',
  user:'unt',
  password: 'B@toul2024',
  database: 'unt_db',
});

connection.getConnection((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("connected successfully");
});

module.exports = connection.promise();