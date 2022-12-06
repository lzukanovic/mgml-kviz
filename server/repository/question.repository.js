const { connect } = require('../config/db.config');
const logger = require('../logger/logger');

class QuestionRepository {

  db = {};

  constructor() {
    this.db = connect();
    // TODO: For Development
    // this.db.sequelize.sync({force: true})
    // .then(async () => {
    //   logger.info("Drop and re-sync db.");
    //   await this.db.section.create({
    //     title: 'Razstava Emona',
    //     description: 'Najboljša razstava o rimskem mestu Emona, oz. bivša Ljubljana.'
    //   });
    //   await this.db.section.create({
    //     title: 'Kmalu prihajajoča razstava',
    //     description: 'To je opis neke nove razstave, ki se bo kmalu odprla!'
    //   });
    //   await this.db.question.create({
    //     title: 'Iz katerega zgodovinskega obdobja je mesto Emona?',
    //     description: 'Zgodovinska obdobja so na primer: kamena doba, bronasta doba, železna doba (1200-550 pnš) itd.',
    //     sectionId: 1,
    //     type: 'singleChoice',
    //     content: 'text'
    //   });
    // });
  }

  async getQuestions(sectionId, query) {
    if (!query.length) {
      query = ['title', 'ASC'];
    }
    try {
      const questions = await this.db.question.findAll({
        where: {
          sectionId: sectionId
        },
        order: [
          query
        ]
      });
      logger.info(`GET /section/${sectionId}/question :::` + questions.toString());
      return questions;
    } catch (err) {
      logger.error(`GET /section/${sectionId}/question :::` + err);
      return [];
    }
  }

  async getQuestion(questionId) {
    let data = {};
    try {
      data = await this.db.question.findByPk(questionId);
      logger.info(`GET /question/${questionId} :::` + data);
    } catch(err) {
      logger.error(`GET /question/${questionId} :::` + err);
    }
    return data;
  }

  async createQuestion(question) {
    let data = {};
    try {
      data = await this.db.question.create(question);
      logger.info(`POST /section/${question.sectionId}/question :::` + data);
    } catch(err) {
      logger.error(`POST /section/${question.sectionId}/question :::` + err);
    }
    return data;
  }

  async updateQuestion(question) {
    let data = {};
    try {
      data = await this.db.question.update({...question}, {
        where: {
          id: question.id
        }
      });
      logger.info(`PUT /section/${question.sectionId}/question :::` + data);
    } catch(err) {
      logger.error(`PUT /section/${question.sectionId}/question :::` + err);
    }
    return data;
  }

  async deleteQuestion(questionId) {
    let data = {};
    try {
      data = await this.db.question.destroy({
        where: {
          id: questionId
        }
      });
      logger.info(`DELETE /section/${questionId}/question :::` + data);
    } catch(err) {
      logger.error(`DELETE /section/${questionId}/question :::` + err);
    }
    return data;
  }
}

module.exports = new QuestionRepository();
