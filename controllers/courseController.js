const dbb = require("../config/connection");
const bcrypt = require('bcrypt');
const validator = require('validator');
const {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } = require('firebase/storage');
  const storage = getStorage();
  const getAllCourses = async (req, res) => {
    try {
      const [result] = await dbb.query(`SELECT * FROM course`);
      res.status(200).json({
        success: true,
        message: "Users data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to get new user",
        error,
      });
    }
  };
  const getAllCoursesByName = async (req, res) => {
    try {
     const { languageName } = req.params;
     const [result] = await dbb.query(`SELECT * FROM course WHERE languageName='${languageName}'`);
     res.status(200).json({
       success: true,
       message: "Courses data retrieved successfully",
       data: result,
     });
    } catch (error) {
     res.status(400).json({
       success: false,
       message: "Unable to get courses",
       error,
     });
    }
   };
   const getAllCoursesByLevel = async (req, res) => {
    try {
     const { level } = req.params;
     const [result] = await dbb.query(`SELECT * FROM course WHERE level='${level}'`);
     res.status(200).json({
       success: true,
       message: "Courses data retrieved successfully",
       data: result,
     });
    } catch (error) {
     res.status(400).json({
       success: false,
       message: "Unable to get courses",
       error,
     });
    }
   };
   const getAllCoursesByType = async (req, res) => {
    try {
     const { type } = req.params;
     const [result] = await dbb.query(`SELECT * FROM course WHERE type='${type}'`);
     res.status(200).json({
       success: true,
       message: "Courses data retrieved successfully",
       data: result,
     });
    } catch (error) {
     res.status(400).json({
       success: false,
       message: "Unable to get courses",
       error,
     });
    }
   };
const AddCourse = async (req, res) => {
    const { languageName, level, zoom_link } = req.body;
  
    try {
        const file = await FileUpload(req.file);
        const img = file.downloadURL;
        const checkQuery = `SELECT COUNT(*) as count FROM course WHERE languageName='${languageName}' AND level='${level}'`;
        const [countResult] = await dbb.query(checkQuery);
  
        if (countResult[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "The language already has this level, try to add another One!",
            });
        }
        const [result] = await dbb.query(
            `INSERT INTO course(languageName, level, img, zoom_link) VALUES ('${languageName}','${level}','${img}','${zoom_link}')`
        );
  
        res.status(200).json({
            success: true,
            message: "Course Data Added successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unfortunately, Unable to Add New Course",
            error,
        });
    }
  };
const UpdateCourse = async (req, res) => {
    const { languageName, level, zoom_link } = req.body;
    const id=req.params.id;
    try {
        const [oldCourse] = await dbb.query(`SELECT * FROM course WHERE id=${id}`);
        const oldImg = oldCourse.img;
    
        let newImg;
        if (req.file) {
            const file = await FileUpload(req.file);
            newImg = file.downloadURL;
        } else {
            newImg = oldImg;
        }
        
        const checkQuery = `SELECT COUNT(*) as count FROM course WHERE languageName='${languageName}' AND level='${level}'`;
        const [countResult] = await dbb.query(checkQuery);
   
        if (countResult[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "You haven't Update this Course, or Maybe your edits are already present!",
            });
        }
   
        const [result] = await dbb.query(
            `UPDATE course SET languageName='${languageName}', level='${level}', img='${newImg}', zoom_link='${zoom_link}' WHERE id=${id}`
        );
   
        res.status(200).json({
            success: true,
            message: "Course Data Updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unfortunately, Unable to Update Course",
            error,
        });
    }
   };
   
 
 const FileUpload = async (file) => {
    const dateTime = giveCurrentDateTime();
    
      const storageRef = ref(
        storage,
         `files/${file.originalname + '       ' + dateTime}`
      );
    
      // Create file metadata including the content type
      const metadata = {
        contentType: file.mimetype,
      };
    
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    
      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);
    
      console.log('File successfully uploaded.');
      return {
        message: 'file uploaded to firebase storage',
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
      };
    };
    
 const giveCurrentDateTime = () => {
      const today = new Date();
      const date =
        today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const dateTime = date + ' ' + time;
      return dateTime;
    };
    const deleteCourse = async (req, res) => {
        try {
          const [result] = await dbb.query(`DELETE FROM course WHERE id = ?`, [
            req.params.id,
          ]);
          res.status(200).json({
            success: true,
            message: 'Data deleted successfully',
            data: result,
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Unable to delete data',
            error,
          });
        }
      };
    module.exports = {
       AddCourse,UpdateCourse,deleteCourse,getAllCourses,getAllCoursesByType,getAllCoursesByName,getAllCoursesByLevel}