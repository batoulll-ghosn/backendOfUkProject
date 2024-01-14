const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const control = require("../controllers/workshopController");
router.get("/getAll", control.getAllWorkshops);
router.get('/getEngagedWorkshops/:user_id', control.getEngagedWorkshopWhereUser);
router.post("/engageToWorshop", control.EngageToWorkshop);
router.post('/AddWorkshop',upload.single('img'), control.AddWorkshop);
router.put('/EditWorkshop/:id',upload.single('img'),control.UpdateWorkshop);
router.delete('/deleteWorkshop/:id',control.DeleteWorkshop);
module.exports = router;