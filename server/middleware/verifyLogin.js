const { connect } = require("../config/db.config");
const logger = require("../logger/logger");
const db = connect()
const Account = db.account;

checkDuplicateUsername = async (req, res, next) => {
  let account = {};
  try {
    account = await Account.findOne({
      where: {
        username: req.body.username
      }
    });

    if (account) {
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
