const dbb = require("../config/connection");

const getAllUsers = async (req, res) => {
  try {
    const [result] = await dbb.query(`SELECT * FROM users`);
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
const register = async (req, res) => {
    const { email, fullName, img, gender,created_at,active } = req.body;
    const role = "student";
    try {
      const [result] = await dbb.query(
        `INSERT INTO userss(email, fullName, img, gender,role,created_at,active) VALUES ("${email}","${fullName}}","${img}","${gender}}","${role}","${created_at}","${active}"})`
      );
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
module.exports = {
    getAllUsers,register}