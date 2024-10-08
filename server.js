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
app.use(express.json());
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const confrencesRoutes=require("./routes/confrencesRoutes");
const workshopsRoutes=require("./routes/workshopsRoutes");
const engagedtoconfrenceRoutes=require("./routes/engageToConf");
const emailRoute = require('./routes/emailRoutes');
app.use("/users", userRoutes);
app.use("/courses",courseRoutes);
app.use("/confrences",confrencesRoutes);
app.use("/workshops",workshopsRoutes);
app.use("/EngaConference",engagedtoconfrenceRoutes);
app.use('/email', emailRoute);

app.listen(8000,()=>{
   console.log('server is running on port:8000')
})
