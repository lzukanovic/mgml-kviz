const logger = require("../logger/logger");
const userRepository = require("../repository/user.repository");

class AuthController {
  async register(req, res) {
    logger.info('Controller: register');
    return await userRepository.register(req, res);
  }

  async login(req, res) {
    logger.info('Controller: login');
    return await userRepository.login(req, res);
  }
}
module.exports = new AuthController();
