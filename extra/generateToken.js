const jwt = require('jsonwebtoken');

exports.generateToken = (id, role) => {
  const token = jwt.sign({ id, role }, 'batoul@#123456789', {
    expiresIn: '1h',
  });
  console.log(token);
  return token;
};