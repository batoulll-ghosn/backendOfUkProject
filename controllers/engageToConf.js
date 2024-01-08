const dbb = require("../config/connection");
const EngageToConf = async (req, res) => {
    const {confrence_id, user_id} = req.body;
  
    try {
        const [result] = await dbb.query(
            `INSERT INTO engagedtoconfrence(confrence_id, user_id) VALUES ('${confrence_id}','${user_id}')`
        );
  
        res.status(200).json({
            success: true,
            message: "Engagement to conference was successfull",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Engagement to conference was not successfull",
            error:error.toString(),
        });
    }
  };

module.exports={EngageToConf}