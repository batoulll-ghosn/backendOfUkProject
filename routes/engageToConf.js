const express = require("express");
const router = express.Router();
const control = require("../controllers/engageToConf");
router.get('/getEngagedConf', control.getEnngagedConfWhereUser);
router.post("/engageToConference", control.EngageToConf);
module.exports = router;