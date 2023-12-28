require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
connection=require("./config/connection");
app.use(bodyParser.json());
app.listen(8000,()=>{
    console.log('server is running on port:8000')
})
/*https://www.db4free.net/phpMyAdmin/index.php?route=/database/structure&db=ourllcc*/