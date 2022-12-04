const logger = require('../logger/logger');
const sectionRepository  = require('../repository/section.repository');

class SectionController {

  async getSections() {
    logger.info('Controller: getSections')
    return await sectionRepository.getSections();
  }
}
module.exports = new SectionController();
