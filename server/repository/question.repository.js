const { connect } = require('../config/db.config');
const logger = require('../logger/logger');

class QuestionRepository {

  db = {};

  constructor() {
    this.db = connect();
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
      throw new Error(err);
    }
    return data;
  }

  async createQuestion(question) {
    let data = {};
    try {
      data = await this.db.question.create(question);
      logger.info(`POST /section/${question.sectionId}/question/${question.id} :::` + data);
    } catch(err) {
      logger.error(`POST /section/${question.sectionId}/question/${question.id} :::` + err);
      throw new Error(err);
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
      logger.info(`PUT /section/${question.sectionId}/question/${question.id} :::` + data);
    } catch(err) {
      logger.error(`PUT /section/${question.sectionId}/question/${question.id} :::` + err);
      throw new Error(err);
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
      logger.info(`DELETE /section/.../question/${questionId} :::` + data);
    } catch(err) {
      logger.error(`DELETE /section/.../question/${questionId} :::` + err);
      throw new Error(err);
    }
    return data;
  }
}

module.exports = new QuestionRepository();
