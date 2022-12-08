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

  // TODO: remove
  // async createAnswer(answer) {
  //   logger.info('Controller: createAnswer ' + answer);
  //   return await answerRepository.createAnswer(answer);
  // }

  async createAnswers(answers) {
    logger.info('Controller: createAnswers ' + answers);
    return await answerRepository.createAnswers(answers);
  }

  // TODO: remove
  // async updateAnswer(answer) {
  //   logger.info('Controller: updateAnswer ' + answer);
  //   return await answerRepository.updateAnswer(answer);
  // }

  async updateAnswers(answers) {
    logger.info('Controller: updateAnswers ' + answers);
    return await answerRepository.updateAnswers(answers);
  }

  // TODO: remove
  // async deleteAnswer(answerId) {
  //   logger.info('Controller: deleteAnswer ' + answerId);
  //   return await answerRepository.deleteAnswer(answerId);
  // }

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
