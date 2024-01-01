require("dotenv").config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');

initializeApp(firebaseConfig);
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
connection=require("./config/connection");
const cors = require ('cors');
app.use(bodyParser.json());
app.get ("/",(req,res)=>{
    res.setHeader("Acceess-Control-Allow-Credentials","true");
    res.send("API is running ..");
});
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: 'Internal Server Error', error: err });
   });
   
app.listen(8000,()=>{
   console.log('server is running on port:8000')
})
