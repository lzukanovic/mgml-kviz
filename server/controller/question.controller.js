const logger = require('../logger/logger');
const questionRepository  = require('../repository/question.repository');

class QuestionController {

  async getQuestions(sectionId, query) {
    logger.info('Controller: getQuestions for section ' + sectionId);
    return await questionRepository.getQuestions(sectionId, query);
  }

  async getQuestion(questionId) {
    logger.info('Controller: getQuestion ' + questionId);
    return await questionRepository.getQuestion(questionId);
  }

  async createQuestion(question) {
    logger.info('Controller: createQuestion ' + question);
    return await questionRepository.createQuestion(question);
  }

  async updateQuestion(question) {
    logger.info('Controller: updateQuestion ' + question);
    return await questionRepository.updateQuestion(question);
  }

  async deleteQuestion(questionId) {
    logger.info('Controller: deleteQuestion ' + questionId);
    return await questionRepository.deleteQuestion(questionId);
  }
}
module.exports = new QuestionController();
