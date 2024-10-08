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
const getAllWorkshops = async (req, res) => {
    try {
      const [result] = await dbb.query(`SELECT * FROM workshops`);
      res.status(200).json({
        success: true,
        message: "Workshops data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to get Workshops",
        error:error.toString(),
      });
    }
  };
const getWorkshopById = async (req, res) => {
  const id=req.params.id;
    try {
      const [result] = await dbb.query(`SELECT * FROM workshops WHERE id=${id}`);
      res.status(200).json({
        success: true,
        message: "Workshops data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to get Workshops",
        error:error.toString(),
      });
    }
  };
const EngageToWorkshop = async (req, res) => {
    const {workshop_id, user_id} = req.body;
    const paid = 1 ;
    try {
        const [existingRow] = await dbb.query(
            `SELECT * FROM engagedtoworkshop WHERE workshop_id='${workshop_id}' AND user_id='${user_id}'`
        );
        
        if (existingRow.length > 0) {
            throw new Error("You have already submitted to this workshop.");
        } else {
            const [result] = await dbb.query(
                `INSERT INTO engagedtoworkshop (workshop_id, user_id, paid) VALUES ('${workshop_id}','${user_id}','${paid}')`
            );
            res.status(200).json({
                success: true,
                message: "Engagement to workshop was successful",
                data: result,
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Engagement to Workshop was not successful",
            error: error.toString(),
        });
    }
  };
  const getEngagedWorkshopWhereUser = async (req, res) => {
    const { user_id } = req.params;
    try {
      const [result] = await dbb.query(`
        SELECT workshops.*, engagedtoworkshop.workshop_id, engagedtoworkshop.paid
        FROM workshops 
        JOIN engagedtoworkshop ON engagedtoworkshop.workshop_id = workshops.id
        WHERE engagedtoworkshop.paid = '1' AND engagedtoworkshop.user_id = ?;
      `, [user_id]);
      res.status(200).json({
        success: true,
        message: "Workshop data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to get the Workshop",
        error,
      });
    }
  };
  
const AddWorkshop = async (req, res) => {
  const {workshopname,type, date,price,zoom_link} = req.body;
  const abv="w"
  try {
      const file = await FileUpload(req.file);
      const img = file.downloadURL;
      const checkQuery = `SELECT * FROM workshops WHERE workshopname='${workshopname}'`;
      const [countResult] = await dbb.query(checkQuery);

      if (countResult.length > 0) {
          return res.status(400).json({
              success: false,
              message: "This Workshop already exicts!",
          });
      }
      const [result] = await dbb.query(
          `INSERT INTO workshops(workshopname, type, date,img,price,abv,zoom_link) VALUES ('${workshopname}','${type}','${date}','${img}','${price}','${abv}','${zoom_link}')`
      );

      res.status(200).json({
          success: true,
          message: "Workahop Data Added successfully",
          data: result,
      });
  } catch (error) {
      res.status(400).json({
          success: false,
          message: "Unfortunately, Unable to Add New Workshop",
          error:error.toString(),
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
const DeleteWorkshop = async (req, res) => { 
    try {
      const [result] = await dbb.query(`DELETE FROM workshops WHERE id = ?`, [
        req.params.id,
      ]);
      
      res.status(200).json({
          success: true,
          message: "Workshop deleted successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Unable to delete workshop",
          error: error.message,
        });
      }
    };
const UpdateWorkshop = async (req, res) => {
      const { workshopname,type, date,price,zoom_link} = req.body;
      const id=req.params.id;
      try {
          const [oldWorkshop] = await dbb.query(`SELECT * FROM workshops WHERE id=${id}`);
          const oldImg = oldWorkshop[0].img;
          console.log(oldWorkshop[0]);
          let newImg;
          if (req.file) {
              const file = await FileUpload(req.file);
              newImg = file.downloadURL;
          } else {
              newImg = oldImg;
          }
          
          const checkQuery = `SELECT COUNT(*) as count FROM workshops WHERE workshopname='${workshopname}'`;
          const [countResult] = await dbb.query(checkQuery);
     
          if (countResult[0].count > 0) {
              return res.status(400).json({
                  success: false,
                  message: "You haven't Update this Workshop, or Maybe your edits are already present!",
              });
          }
     
          const [result] = await dbb.query( 
              `UPDATE workshops SET workshopname='${workshopname}', type='${type}',date = '${date}', img='${newImg}', price='${price}',zoom_link='${zoom_link}' WHERE id=${id}`
          );
     
          res.status(200).json({
              success: true,
              message: "Workshop Data Updated successfully",
              data: result,
          });
      } catch (error) {
          res.status(400).json({
              success: false,
              message: "Unfortunately, Unable to Update Workshop",
              error:error.toString(),
          });
      }
     };
module.exports={getAllWorkshops,EngageToWorkshop,getWorkshopById,UpdateWorkshop,getEngagedWorkshopWhereUser,AddWorkshop,DeleteWorkshop}