const dbb = require("../config/connection");
const bcrypt = require('bcrypt');
const { generateToken } = require('../extra/generateToken');
const validator = require('validator');
const {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } = require('firebase/storage');
  const storage = getStorage();
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
const getAllUsersByRole = async (req, res) => {
    try {
    const { role } = req.params;
    const [result] = await dbb.query(`SELECT * FROM users WHERE role='${role}'`);
    res.status(200).json({
      success: true,
      message: "Users data retrieved successfully",
      data: result,
    });
    } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to get users",
      error,
    });
    }
   };
const getAllUsersByFullName = async (req, res) => {
    try {
    const { fullName } = req.params;
    const [result] = await dbb.query(`SELECT * FROM users WHERE fullName='${fullName}'`);
    res.status(200).json({
      success: true,
      message: "Users data retrieved successfully",
      data: result,
    });
    } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to get users",
      error,
    });
    }
   };
const getUsersByEmail = async (req, res) => {
    try {
    const { email } = req.params;
    const [result] = await dbb.query(`SELECT * FROM users WHERE email='${email}'`);
    res.status(200).json({
      success: true,
      message: "Users data retrieved successfully",
      data: result,
    });
    } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to get users",
      error,
    });
    }
   };
const getAllUsersActive = async (req, res) => {
    try {
    const active  = 1;
    const [result] = await dbb.query(`SELECT * FROM users WHERE active=${active}`);
    res.status(200).json({
     success: true,
     message: "Users data retrieved successfully",
     data: result,
    });
    } catch (error) {
    res.status(400).json({
     success: false,
     message: "Unable to get users",
     error,
    });
    }
   };
const getAllUsersNonActive = async (req, res) => {
    try {
    const active  = 0;
    const [result] = await dbb.query(`SELECT * FROM users WHERE active=${active}`);
    res.status(200).json({
     success: true,
     message: "Users data retrieved successfully",
     data: result,
    });
    } catch (error) {
    res.status(400).json({
     success: false,
     message: "Unable to get users",
     error,
    });
    }
   };
const register = async (req, res) => {
    console.log(req.body);
    const { email, fullName, phone, password } = req.body;
    const role = "student";
    const active = "1";
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "All fields must be filled",
            missingFields: [!email && 'email', !fullName && 'fullName', !phone && 'phone', !password && 'password'].filter(Boolean)
        });
    }
    const passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordStrength.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long, include at least one number, one lowercase letter, one uppercase letter"
        });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Must be a valid email"
        });
    }
    const [emailExists] = await dbb.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
   
    if (emailExists.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'This email is already in use',
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        
        const [result] = await dbb.query(
            `INSERT INTO users(email, fullName,phone, role, created_at, active, password) VALUES ("${email}", "${fullName}","${phone}", "${role}", NOW(), "${active}", "${hashedPassword}")`
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
const AddUser = async (req, res) => {
  const { email, fullName, phone, password,role } = req.body;
 
  const active = "1";
  if (!email || !fullName || !phone || !password) {
      return res.status(400).json({
          success: false,
          message: "All fields must be filled",
          missingFields: [!email && 'email', !fullName && 'fullName', !phone && 'phone', !password && 'password'].filter(Boolean)
      });
  }
  const passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordStrength.test(password)) {
      return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long, include at least one number, one lowercase letter, one uppercase letter"
      });
  }
  if (!validator.isEmail(email)) {
      return res.status(400).json({
          success: false,
          message: "Must be a valid email"
      });
  }
  const [emailExists] = await dbb.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
  );
 
  if (emailExists.length > 0) {
      return res.status(400).json({
          success: false,
          message: 'This email is already in use',
      });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
      const [result] = await dbb.query(
          `INSERT INTO users(email, fullName,phone, role, created_at, active, password) VALUES ("${email}", "${fullName}","${phone}", "${role}", NOW(), "${active}", "${hashedPassword}")`
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
const loginUser = async (req, res) => {
    const { Email, password } = req.body;
 
    try {
        const [result] = await dbb.query(
            `SELECT * FROM users WHERE email = ?`,
            [Email]
        );
        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }
 
        const hashedPassword = result[0].password;
        console.log('Entered Password:', password);
        console.log('Hashed Password:', hashedPassword);
 
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
 
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Wrong password',
            });
        }
        const token = generateToken(result[0].id, result[0].role);
        console.log(result[0].role);
        console.log(result[0].id);
        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            token: token,
          });
 
          } catch (error) {
           res.status(400).json({
            success: false,
            message: 'Unable to log in',
            error: error.message,
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
const loginUserGoogle = async (req, res) => {
        const { Email } = req.body;
     
        try {
            const [result] = await dbb.query(
                `SELECT * FROM users WHERE email = ?`,
                [Email]
            );
            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }
     
            console.log(result)
            const token = generateToken(result[0].id, result[0].role);
                
            return res.status(200).json({
                success: true,
                message: 'Login successfully',
                token: token,
              });
     
              } catch (error) {
               res.status(400).json({
                success: false,
                message: 'Unable to log in',
                error: error.message,
            });
        }
     };
const deleteUser = async (req, res) => {
        try {
          const [result] = await dbb.query(`DELETE FROM users WHERE id = ?`, [
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
      const updateUser = async (req, res) => {
        const { email, fullName, oldPassword, newPassword } = req.body;
        const userId = req.params.id;
    
        try {
            const [oldUser] = await dbb.query(
                `SELECT * FROM users WHERE id = ?`,
                [userId]
            );
    
            if (!oldUser || oldUser.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            const passwordMatch = oldPassword ? await bcrypt.compare(oldPassword, oldUser[0].password) : false;
           console.log(oldPassword)
            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Old password is incorrect',
                });
            }
    
        
            let hashedPassword;
            if (newPassword) {
                hashedPassword = await bcrypt.hash(newPassword, 10);
            }
    
            const [result] = await dbb.query(
                `UPDATE users SET email = ?, fullName = ?, password = ? WHERE id = ?`,
                [email, fullName, hashedPassword || oldUser[0].password, userId]
            );
    
            res.status(200).json({
                success: true,
                message: 'Data updated successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Unable to update data',
                error: error.message,
            });
        }
    };
    
const AdminupdateUser = async (req, res) => {
      const { email, fullName } = req.body;
      const userId = req.params.id;
      try {
        const [result] = await dbb.query(
          `UPDATE users SET email = ?, fullName = ? WHERE id = ?`,
          [email, fullName, userId]
        );
        res.status(200).json({
          success: true,
          message: 'Data updated successfully',
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Unable to update data',
          error,
        });
      }
     };
     
const switchToActivateUser = async (req, res) => {
        const userId = req.params.id;
      
        try {
            const [result] = await dbb.query(
                `UPDATE users SET active = 1 WHERE id = ?`,
                [userId]
            );
      
            res.status(200).json({
                success: true,
                message: 'User activated successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Unable to activate user',
                error,
            });
        }
      };
const switchToNonActivateUser = async (req, res) => {
        const userId = req.params.id;
      
        try {
            const [result] = await dbb.query(
                `UPDATE users SET active = 0 WHERE id = ?`,
                [userId]
            );
      
            res.status(200).json({
                success: true,
                message: 'User activated successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Unable to activate user',
                error,
            });
        }
      };
const switchToTrainer = async (req, res) => {
        const userId = req.params.id;
      
        try {
            const [result] = await dbb.query(
                `UPDATE users SET role = "trainer" WHERE id = ?`,
                [userId]
            );
      
            res.status(200).json({
                success: true,
                message: 'User switched to trainer successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Unable to switch to trainer',
                error,
            });
        }
      };
const switchToStudent = async (req, res) => {
        const userId = req.params.id;
      
        try {
            const [result] = await dbb.query(
                `UPDATE users SET role = "student" WHERE id = ?`,
                [userId]
            );
      
            res.status(200).json({
                success: true,
                message: 'User switched to student successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Unable to switch to student',
                error,
            });
        }
      };     
      
module.exports = {
    getAllUsers,getAllUsersByRole,loginUserGoogle,getUsersByEmail,AddUser,AdminupdateUser,switchToTrainer,switchToStudent,switchToActivateUser,switchToNonActivateUser,getAllUsersActive,getAllUsersNonActive,getAllUsersByFullName,register,loginUser,deleteUser,updateUser}