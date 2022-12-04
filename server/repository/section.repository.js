const { connect } = require('../config/db.config');
const logger = require('../logger/logger');

class SectionRepository {

  db = {};

  constructor() {
    this.db = connect();
    // TODO: For Development
    // This drops and recreates table!
    // this.db.sequelize.sync({ force: true }).then(() => {
    //   logger.info("Drop and re-sync db.");
    // });
  }

  async getSections() {
    try {
      const sections = await this.db.section.findAll();
      logger.info('GET /section :::', sections.toString());
      return sections;
    } catch (err) {
      logger.error(err);
      return [];
    }
  }

  // TODO: async createSection(section) {}
  // TODO: async updateSection(section) {}
  // TODO: async deleteSection(sectionId) {}
}

module.exports = new SectionRepository();
