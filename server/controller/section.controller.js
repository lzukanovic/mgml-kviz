const logger = require('../logger/logger');
const sectionRepository  = require('../repository/section.repository');

class SectionController {

  async getSections() {
    logger.info('Controller: getSections')
    return await sectionRepository.getSections();
  }

  async getSection(sectionId) {
    logger.info('Controller: getSection' + sectionId);
    return await sectionRepository.getSection(sectionId);
  }

  async createSection(section) {
    logger.info('Controller: createSection' + section);
    return await sectionRepository.createSection(section);
  }

  async updateSection(section) {
    logger.info('Controller: updateSection' + section);
    return await sectionRepository.updateSection(section);
  }

  async deleteSection(sectionId) {
    logger.info('Controller: deleteSection' + sectionId);
    return await sectionRepository.deleteSection(sectionId);
  }
}
module.exports = new SectionController();
