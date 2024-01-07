const express = require("express");
const router = express.Router();
const control = require("../controllers/engageToConf");
router.post("/engageToConference", control.EngageToConf);
module.exports = router;