const dbb = require("../config/connection");
const EngageToConf = async (req, res) => {
    const {confrence_id, user_id} = req.body;
    const paid =0
    try {
        const [existingRow] = await dbb.query(
            `SELECT * FROM engagedtoconfrence WHERE confrence_id='${confrence_id}' AND user_id='${user_id}'`
        );
        
        if (existingRow.length > 0) {
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
const getEnngagedConfWhereUser = async (req, res) => {
    const {user_id} = req.params;
    try {
      const [result] = await dbb.query(`SELECT confrences.*, engagedtoconfrence.paid, engagedtoconfrence.user_id
      FROM confrences 
          LEFT JOIN engagedtoconfrence ON engagedtoconfrence.confrence_id = confrences.id
      WHERE engagedtoconfrence.paid = '1' AND engagedtoconfrence.user_id = ${user_id}`);
      res.status(200).json({
        success: true,
        message: "Conference data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to get the Conference",
        error,
      });
    }
   };
   const AddTestimonial = async (req, res) => {
    const { user_id } = req.params;
    const {nameOftestemoniated, description } = req.body;
   const type='www';
    try {
        const query = `
            INSERT INTO testemoniage
            (user_id, type, nameOftestemoniated, description)
            VALUES (?, ?, ?, ?)`;

        const [result] = await dbb.query(query, [user_id, type, nameOftestemoniated, description]);

        res.status(200).json({
            success: true,
            message: "Testimonial data added successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to add the testimonial",
            error,
        });
    }
};
const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
      const query = `DELETE FROM testemoniage WHERE id = ?`;
      const [result] = await dbb.query(query, [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({
              success: false,
              message: "Testimonial not found for deletion",
          });
      }

      res.status(200).json({
          success: true,
          message: "Testimonial deleted successfully",
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Unable to delete the testimonial",
          error,
      });
  }
};
const getAllTestimonials = async (req, res) => {
  try {
      const query = "SELECT * FROM testemoniage";
      const [testimonials] = await dbb.query(query);

      res.status(200).json({
          success: true,
          message: "Testimonials retrieved successfully",
          data: testimonials,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Unable to retrieve testimonials",
          error,
      });
  }
};

module.exports={EngageToConf,getEnngagedConfWhereUser,AddTestimonial,deleteTestimonial,getAllTestimonials};
