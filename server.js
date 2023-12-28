require("dotenv").config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');

initializeApp(firebaseConfig);
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
connection=require("./config/connection");

// Setup body-parser middleware
app.use(bodyParser.json());

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

app.listen(8000,()=>{
   console.log('server is running on port:8000')
})
