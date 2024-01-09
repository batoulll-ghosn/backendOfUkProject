const dbb = require("../config/connection");
const EngageToConf = async (req, res) => {
   const {confrence_id, user_id} = req.body;
  const paid ='0'
   try {
       // Check if a row with the given user_id and conference_id already exists
       const [existingRow] = await dbb.query(
           `SELECT EXISTS(SELECT 1 FROM engagedtoconfrence WHERE confrence_id='${confrence_id}' AND user_id='${user_id}') AS exists`
       );
       
       if (existingRow[0].exists) {
           throw new Error("You have already submitted to this conference.");
       } else {
           const [result] = await dbb.query(
               `INSERT INTO engagedtoconfrence(confrence_id, user_id, paid) VALUES ('${confrence_id}','${user_id}','${paid}')`
           );
           res.status(200).json({
               success: true,
               message: "Engagement to conference was successful",
               data: result,
           });
       }
   } catch (error) {
       res.status(400).json({
           success: false,
           message: "Engagement to conference was not successful",
           error: error.toString(),
       });
   }
};

module.exports={EngageToConf};
