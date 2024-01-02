require("dotenv").config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');
initializeApp(firebaseConfig);
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
connection=require("./config/connection");
const cors = require ('cors');
app.use(cors());
app.use(bodyParser.json());

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const confrencesRoutes=require("./routes/confrencesRoutes");
app.use("/users", userRoutes);

app.use("/courses",courseRoutes);
app.use("/confrences",confrencesRoutes)
app.listen(8000,()=>{
   console.log('server is running on port:8000')
})
