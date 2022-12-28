const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const {authJwt} = require("../middleware");

class UserRepository {

  db = {};

  constructor() {
    this.db = connect();
  }

  async register(req, res) {
    let user = {};
    try {
      // create user account
      const {salt, hash} = authJwt.setPassword(req.body.password)
      user = await this.db.user.create({
        username: req.body.username,
        salt,
        hash,
      });

      // generate token
      const payload = {id: user.id, username: user.username};
      const token = authJwt.generateToken(payload);

      // respond
      logger.info(`/register ::: username: ${user.username}, hash: ${user.hash}, salt: ${user.salt}`);
      res.status(201).send({
        id: user.id,
        username: user.username,
        token
      });
    } catch(err) {
      logger.error('/register :::' + err);
      res.status(500).send({ message: err.message });
    }
  }

  async login(req, res) {
    let user = {};
    try {
      // get user
      user = await this.db.user.findOne({
        where: {
          username: req.body.username
        }
      });

      // user not found
      if (!user) {
        return res.status(404).send({
          token: null,
          message: "Napačno uporabniško ime ali geslo!"
        });
      }

      // verify login
      const passwordIsValid = authJwt.verifyPassword(req.body.password, user.salt, user.hash)

      // incorrect credentials
      if (!passwordIsValid) {
        return res.status(401).send({
          token: null,
          message: "Napačno uporabniško ime ali geslo!"
        });
      }

      // generate token
      const payload = {id: user.id, username: user.username};
      const token = authJwt.generateToken(payload);

      // respond
      logger.info(`/login ::: username: ${user.username}, token: ${token}`);
      res.status(200).send({
        id: user.id,
        username: user.username,
        token
      });
    } catch(err) {
      logger.error('/login :::' + err);
      res.status(500).send({ message: err.message });
    }
  }
}

module.exports = new UserRepository();
