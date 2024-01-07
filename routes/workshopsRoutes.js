const express = require("express");
const router = express.Router();
const control = require("../controllers/workshopController");
router.get("/getAll", control.getAllWorkshops);
module.exports = router;