require("dotenv").config();
const mysql = require("mysql2");
const HOST=process.env.HOST;
const connection = mysql.createPool({
  host: "b1s0wdsrra7frccxbuvr-mysql.services.clever-cloud.com",
  user:"umoytzm5nwyta8ct",
  password: "nqGAAKMQIWpQ2dZ6chEl",
  database: "b1s0wdsrra7frccxbuvr"
});

connection.getConnection((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("connected successfully");
});

module.exports = connection.promise();