const jwt = require("jsonwebtoken");
const crypto = require('crypto');

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "Prepovedan dostop do vsebine!"
    });
  }

  token = token.split(' ')[1];
  jwt.verify(token, process.env.SECRET, {}, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Nepooblaščen dostop!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

generateToken = (payload) => {
  // expire in 7 days
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  const expiresIn = parseInt((expiry.getTime() / 1000).toString());

  return jwt.sign(
    { ...payload, exp: expiresIn },
    process.env.SECRET,
    null,
    null
  );
}

verifyPassword = (password, salt, hash) => {
  const hashCalculated = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashCalculated;
};

setPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return {
    salt,
    hash
  }
};

const authJwt = {
  verifyToken: verifyToken,
  generateToken: generateToken,
  verifyPassword: verifyPassword,
  setPassword: setPassword
};
module.exports = authJwt;
