const logger = require('../logger/logger');
const answerRepository  = require('../repository/answer.repository');

class AnswerController {

  async getAnswers(questionId) {
    logger.info('Controller: getAnswers for question ' + questionId);
    return await answerRepository.getAnswers(questionId);
  }

  async getAnswer(answerId) {
    logger.info('Controller: getAnswer ' + answerId);
    return await answerRepository.getAnswer(answerId);
  }

  async createAnswers(answers) {
    logger.info('Controller: createAnswers ' + answers);
    return await answerRepository.createAnswers(answers);
  }

  async updateAnswers(answers) {
    logger.info('Controller: updateAnswers ' + answers);
    return await answerRepository.updateAnswers(answers);
  }

  async deleteAnswers(answerIds) {
    logger.info('Controller: deleteAnswers ' + answerIds);
    return await answerRepository.deleteAnswers(answerIds);
  }

  async incrementAnswers(answers) {
    logger.info('Controller: incrementAnswers ' + answers.map(a => a.id));
    return await answerRepository.incrementAnswers(answers);
  }
}
module.exports = new AnswerController();
