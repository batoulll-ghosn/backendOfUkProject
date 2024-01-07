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
  module.exports={getAllWorkshops}