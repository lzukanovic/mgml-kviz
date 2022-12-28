const { connect } = require("../config/db.config");
const logger = require("../logger/logger");
const db = connect()
const User = db.user;

checkDuplicateUsername = async (req, res, next) => {
  let user = {};
  try {
    user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (user) {
      res.status(400).send({
        message: "Napaka! Uporabniško ime že obstaja."
      });
    } else {
      next();
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

const verifySignUp = {
  checkDuplicateUsername: checkDuplicateUsername,
};

module.exports = verifySignUp;
