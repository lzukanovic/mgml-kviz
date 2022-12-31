const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const {authJwt} = require("../middleware");

class UserRepository {

  db = {};

  constructor() {
    this.db = connect();
  }

  async register(req, res) {
    let account = {};
    try {
      // create account
      const {salt, hash} = authJwt.setPassword(req.body.password)
      account = await this.db.account.create({
        username: req.body.username,
        salt,
        hash,
      });

      // generate token
      const payload = {id: account.id, username: account.username};
      const token = authJwt.generateToken(payload);

      // respond
      logger.info(`/register ::: username: ${account.username}, hash: ${account.hash}, salt: ${account.salt}`);
      res.status(201).send({
        id: account.id,
        username: account.username,
        token
      });
    } catch(err) {
      logger.error('/register :::' + err);
      res.status(500).send({ message: err.message });
    }
  }

  async login(req, res) {
    let account = {};
    try {
      // get account
      account = await this.db.account.findOne({
        where: {
          username: req.body.username
        }
      });

      // account not found
      if (!account) {
        return res.status(404).send({
          token: null,
          message: "Napačno uporabniško ime ali geslo!"
        });
      }

      // verify login
      const passwordIsValid = authJwt.verifyPassword(req.body.password, account.salt, account.hash)

      // incorrect credentials
      if (!passwordIsValid) {
        return res.status(401).send({
          token: null,
          message: "Napačno uporabniško ime ali geslo!"
        });
      }

      // generate token
      const payload = {id: account.id, username: account.username};
      const token = authJwt.generateToken(payload);

      // respond
      logger.info(`/login ::: username: ${account.username}, token: ${token}`);
      res.status(200).send({
        id: account.id,
        username: account.username,
        token
      });
    } catch(err) {
      logger.error('/login :::' + err);
      res.status(500).send({ message: err.message });
    }
  }
}

module.exports = new UserRepository();
