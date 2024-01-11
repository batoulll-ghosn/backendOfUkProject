const dbb = require("../config/connection");
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
const EngageToWorkshop = async (req, res) => {
    const {workshop_id, user_id} = req.body;
    const paid = 0 ;
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
    const {user_id} = req.params;
    try {
      const [result] = await dbb.query(`SELECT workshops.*, engagedtoworkshop.workshop_id, engagedtoworkshop.paid
      FROM workshops 
        LEFT JOIN engagedtoworkshop ON engagedtoworkshop.workshop_id = workshops.id
      WHERE engagedtoworkshop.workshop_id = ? AND engagedtoworkshop.paid = '1';`, [user_id]);
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
 
module.exports={getAllWorkshops,EngageToWorkshop,getEngagedWorkshopWhereUser}