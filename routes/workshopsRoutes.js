const express = require("express");
const router = express.Router();
const control = require("../controllers/workshopController");
router.get("/getAll", control.getAllWorkshops);
router.get('/getEngagedWorkshops/:user_id', control.getEngagedWorkshopWhereUser);
router.post("/engageToWorshop", control.EngageToWorkshop);
module.exports = router;