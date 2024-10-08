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
const getAllConfrences = async (req, res) => {
    try {
      const [result] = await dbb.query(`SELECT * FROM confrences`);
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
const getConferenceById = async (req, res) => {
  const id=req.params.id;
    try {
      const [result] = await dbb.query(`SELECT * FROM confrences WHERE id=${id} `);
      res.status(200).json({
        success: true,
        message: "Conference data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to get Conference",
        error,
      });
    }
  };
  const AddConference = async (req, res) => {
    const { conference_name, type, date,price, description,zoom_link,resources} = req.body;
    const abv="con"
    try {
        const file = await FileUpload(req.file);
        const img = file.downloadURL;
        const checkQuery = `SELECT COUNT(*) as count FROM confrences WHERE  conference_name='${conference_name}'`;
        const [countResult] = await dbb.query(checkQuery);
  
        if (countResult[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "This Course has already been entered ! Enter Another One Please...",
            });
        }
        const [result] = await dbb.query(
            `INSERT INTO confrences(conference_name, type, date, img, price, description,abv,zoom_link,resources) VALUES ('${conference_name}','${type}','${date}','${img}','${price}','${description}','${abv}','${zoom_link}','${resources}')`
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
const UpdateConference = async (req, res) => {
        const { conference_name, type, date,price, description,zoom_link,resources} = req.body;
        const id=req.params.id;
        try {
            const oldCourse = await dbb.query(`SELECT * FROM confrences WHERE id=${id}`);
            const oldImg = oldCourse[0][0].img;
            console.log(oldCourse[0]);
            let newImg;
            if (req.file) {
                const file = await FileUpload(req.file);
                newImg = file.downloadURL;
            } else {
                newImg = oldImg;
            }
            
            const checkQuery = `SELECT COUNT(*) as count FROM confrences WHERE conference_name='${conference_name}'`;
            const [countResult] = await dbb.query(checkQuery);
       
            if (countResult[0].count > 1) {
                return res.status(400).json({
                    success: false,
                    message: "You haven't Update this Conference, or Maybe your edits are already present!",
                });
            }
       
            const [result] = await dbb.query(
                `UPDATE confrences SET conference_name='${conference_name}', type='${type}', date='${date}',img='${newImg}',price='${price}', description='${description}',zoom_link='${zoom_link}',resources='${resources}'  WHERE id=${id}`
            );
       
            res.status(200).json({
                success: true,
                message: "Conference Data Updated successfully",
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Unfortunately, Unable to Update Conference",
                error: error.toString(),
            });
        }
       };
const getAllConferenceByName = async (req, res) => {
        try {
         const { conference_name } = req.params;
         const [result] = await dbb.query(`SELECT * FROM confrences WHERE conference_name='${conference_name}'`);
         res.status(200).json({
           success: true,
           message: "Conference data retrieved successfully",
           data: result,
         });
        } catch (error) {
         res.status(400).json({
           success: false,
           message: "Unable to get conferences",
           error,
         });
        }
       };
const deleteConf = async (req, res) => {
        try {
          const [result] = await dbb.query(`DELETE FROM confrences WHERE id = ?`, [
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
const getAllConfsWh = async (req, res) => {
        try {
          const [result] = await dbb.query(`
            SELECT engagedtoconfrence.paid, users.email, engagedtoconfrence.confrence_id, confrences.conference_name, confrences.date
            FROM engagedtoconfrence 
            LEFT JOIN users ON engagedtoconfrence.user_id = users.id 
            LEFT JOIN confrences ON engagedtoconfrence.confrence_id = confrences.id
          `);
      
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
const updatePaidStatus = async (req, res) => {
        const { email } = req.params;
        const { conference_id } = req.params;
        try {
          await dbb.query(`
            UPDATE engagedtoconfrence
            SET paid = 1
            WHERE user_id = (SELECT id FROM users WHERE email = ?) AND confrence_id=${conference_id};
          `, [email]);
      
          res.status(200).json({
            success: true,
            message: `Paid status updated successfully for email: ${email}`,
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: "Unable to update paid status",
            error,
          });
        }
      };
const updateNOTPaidStatus = async (req, res) => {
        const { email } = req.params;
        const { conference_id } = req.params;
        try {
          await dbb.query(`
            UPDATE engagedtoconfrence
            SET paid = 0
            WHERE user_id = (SELECT id FROM users WHERE email = ?) AND confrence_id=${conference_id};
          `, [email]);
      
          res.status(200).json({
            success: true,
            message: `Paid status updated successfully for email: ${email}`,
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: "Unable to update paid status",
            error,
          });
        }
      };
module.exports={getAllConfrences,getAllConferenceByName,getConferenceById,updateNOTPaidStatus,updatePaidStatus,AddConference,UpdateConference,deleteConf,getAllConfsWh}