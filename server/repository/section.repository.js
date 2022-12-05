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
      logger.info('GET /sections :::' + sections.toString());
      return sections;
    } catch (err) {
      logger.error('GET /sections :::' + err);
      return [];
    }
  }

  async getSection(sectionId) {
    let data = {};
    try {
      data = await this.db.section.findByPk(sectionId);
      logger.info(`GET /section/${sectionId} :::` + data);
    } catch(err) {
      logger.error(`GET /section/${sectionId} :::` + err);
    }
    return data;
  }

  async createSection(section) {
    let data = {};
    try {
      console.log(section)
      data = await this.db.section.create(section);
      logger.info('POST /section :::' + data);
    } catch(err) {
      logger.error('POST /section :::' + err);
    }
    return data;
  }

  async updateSection(section) {
    let data = {};
    try {
      data = await this.db.section.update({...section}, {
        where: {
          id: section.id
        }
      });
      logger.info('PUT /section :::' + data);
    } catch(err) {
      logger.error('PUT /section :::' + err);
    }
    return data;
  }

  async deleteSection(sectionId) {
    let data = {};
    try {
      data = await this.db.section.destroy({
        where: {
          id: sectionId
        }
      });
      logger.info(`DELETE /section/${sectionId} :::` + data);
    } catch(err) {
      logger.error(`DELETE /section/${sectionId} :::` + err);
    }
    return data;
  }
}

module.exports = new SectionRepository();
