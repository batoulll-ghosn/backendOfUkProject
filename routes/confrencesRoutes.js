const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const control = require("../controllers/confrenceController");
router.get("/getAll", control.getAllConfrences);
router.get("/getConferenceById/:id",control.getConferenceById);
router.get("/getAllWh", control.getAllConfsWh);
router.put('/UpdateToPaid/:email/:conference_id',control.updatePaidStatus);
router.put('/UpdateToNotPaid/:email/:conference_id',control.updateNOTPaidStatus);
router.get("/getByConferenceName/:conference_name", control.getAllConferenceByName);
router.post('/AddConference',upload.single('img'), control.AddConference);
router.put('/EditConference/:id',upload.single('img'),control.UpdateConference);
router.delete('/deleteConf/:id',control.deleteConf);
module.exports = router;