const express = require("express");
const router = express.Router();
const control = require("../controllers/engageToConf");
router.get('/getEngagedConf/:user_id', control.getEnngagedConfWhereUser);
router.get('/getAllTestimonial', control.getAllTestimonials);
router.post("/engageToConference", control.EngageToConf);
router.post("/AddTestimonial/:user_id", control.AddTestimonial);
router.delete('/deleteTestimonial/:id',control.deleteTestimonial);
module.exports = router;