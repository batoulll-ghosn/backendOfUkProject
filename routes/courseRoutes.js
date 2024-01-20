const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const control = require("../controllers/courseController");
router.get("/getAll", control.getAllCourses);
router.get("/getCourseById/:id", control.getAllCoursewhereID);
router.get("/getAllWh", control.getAllCoursesWh);
router.get("/getByLanguageName/:languageName", control.getAllCoursesByName);
router.get("/getByType/:type", control.getAllCoursesByType);
router.get("/getByLanguageLevel/:level", control.getAllCoursesByLevel);
router.post('/EngageToCourse',control.EngageToCourse);
router.post('/EngageTeacherCourse',control.EngageTeacherCourse);
router.post('/AddCourse',upload.single('img'), control.AddCourse);
router.post('/AddSchedule/:course_id/:day/:hour',control.AddSchedule);
router.put('/EditCourse/:id',upload.single('img'),control.UpdateCourse);
router.put('/UpdateToPaid/:email',control.updatePaidStatus);
router.put('/UpdateToNotPaid/:email',control.updateNOTPaidStatus);
router.get('/getEngagedCourseSchedule/:user_id', control.getEngagedCourseWhereUser);
router.get('/getSchedule', control.getSchedule);
router.delete('/deleteCourse/:id',control.deleteCourse);
router.delete('/deleteSchedule/:id',control.DeleteSchedule);
module.exports = router;