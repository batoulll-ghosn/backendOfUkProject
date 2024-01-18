const jwt = require('jwt-simple');

exports.generateToken = (id, role) => {
 const payload = { id, role };
 const secret = 'B@toul#123456789'; 
 const token = jwt.encode(payload, secret);
 console.log(token);
 return token;
};
