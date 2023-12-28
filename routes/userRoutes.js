const express = require("express");
const router = express.Router();
const control = require("../controllers/userController");
router.get("/getAll", control.getAllUsers);
module.exports = router;