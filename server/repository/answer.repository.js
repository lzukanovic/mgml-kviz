const { connect } = require('../config/db.config');
const logger = require('../logger/logger');

class AnswerRepository {

  db = {};

  constructor() {
    this.db = connect();
    // TODO: For Development
    // this.db.sequelize.sync({force: true}).then(async () => {
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
    //   await this.db.answer.create({
    //     text: 'Srednji vek',
    //     questionId: 1,
    //     order: 0
    //   });
    //   await this.db.answer.create({
    //     text: 'Kamena doba',
    //     questionId: 1,
    //     order: 1
    //   });
    // });
  }

  async getAnswers(questionId) {
    try {
      const answers = await this.db.answer.findAll({
        where: {
          questionId: questionId
        },
        order: [
          ['order', 'ASC']
        ]
      });
      logger.info(`GET /section/.../question/${questionId}/answer :::` + answers.toString());
      return answers;
    } catch (err) {
      logger.error(`GET /section/.../question/${questionId}/answer :::` + err);
      return [];
    }
  }

  async getAnswer(answerId) {
    let data = {};
    try {
      data = await this.db.answer.findByPk(answerId);
      logger.info(`GET /section/.../question/.../answer/${answerId} :::` + data);
    } catch(err) {
      logger.error(`GET /section/.../question/.../answer/${answerId} :::` + err);
    }
    return data;
  }

  // TODO: remove
  // async createAnswer(answer) {
  //   let data = {};
  //   try {
  //     data = await this.db.answer.create(answer);
  //     logger.info(`POST /section/.../question/${answer.questionId}/answer :::` + data);
  //   } catch(err) {
  //     logger.error(`POST /section/.../question/${answer.questionId}/answer :::` + err);
  //   }
  //   return data;
  // }

  async createAnswers(answers) {
    let data = {};
    try {
      data = await this.db.answer.bulkCreate(answers);
      logger.info(`POST /section/.../question/${answers[0]?.questionId}/answers :::` + data);
    } catch(err) {
      logger.error(`POST /section/.../question/${answers[0]?.questionId}/answers :::` + err);
    }
    return data;
  }

  // TODO: remove
  // async updateAnswer(answer) {
  //   let data = {};
  //   try {
  //     data = await this.db.answer.update({...answer}, {
  //       where: {
  //         id: answer.id
  //       }
  //     });
  //     logger.info(`PUT /section/.../question/${answer.questionId}/answer/${answer.id} :::` + data);
  //   } catch(err) {
  //     logger.error(`PUT /section/.../question/${answer.questionId}/answer/${answer.id} :::` + err);
  //   }
  //   return data;
  // }

  async updateAnswers(answers) {
    let data = {};
    try {
      data = await this.db.answer.bulkCreate(answers, {
        updateOnDuplicate: ["text", "image", "order", "count", "updatedAt"]
      });
      logger.info(`PUT /section/.../question/${answers[0]?.questionId}/answer/${answers.map(a => a.id)} :::` + data);
    } catch(err) {
      logger.error(`PUT /section/.../question/${answers[0]?.questionId}/answer/${answers.map(a => a.id)} :::` + err);
    }
    return data;
  }

  // TODO: remove
  // async deleteAnswer(answerId) {
  //   let data = {};
  //   try {
  //     data = await this.db.answer.destroy({
  //       where: {
  //         id: answerId
  //       }
  //     });
  //     logger.info(`DELETE /section/.../question/.../${answerId} :::` + data);
  //   } catch(err) {
  //     logger.error(`DELETE /section/.../question/.../${answerId} :::` + err);
  //   }
  //   return data;
  // }

  async deleteAnswers(answerIds) {
    let data = {};
    try {
      data = await this.db.answer.destroy({
        where: {
          id: answerIds
        }
      });
      logger.info(`DELETE /section/.../question/.../${answerIds} :::` + data);
    } catch(err) {
      logger.error(`DELETE /section/.../question/.../${answerIds} :::` + err);
    }
    return data;
  }

  async incrementAnswers(answers) {
    let data = {};
    try {
      data = await this.db.answer.bulkCreate(answers, {
        updateOnDuplicate: ["count", "updatedAt"]
      });
      logger.info(`PUT count /section/.../question/${answers[0]?.questionId}/answer/${answers.map(a => a.id)} :::` + data);
    } catch(err) {
      logger.error(`PUT count /section/.../question/${answers[0]?.questionId}/answer/${answers.map(a => a.id)} :::` + err);
    }
    return data;
  }
}

module.exports = new AnswerRepository();
