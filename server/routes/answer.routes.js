const express = require('express');
const bodyParser = require('body-parser');
const answerController = require('../controller/answer.controller')
const rateLimit = require("express-rate-limit");

const app = express();
app.use(bodyParser.json());

// get all answers by section id and question id
app.get("/section/:sectionId/question/:questionId/answer", (req, res) => {
  answerController.getAnswers(req.params.questionId).then(data => res.json(data));
})

// get answer by id
app.get("/section/:sectionId/question/:questionId/answer/:answerId", (req, res) => {
  answerController.getAnswer(req.params.answerId).then(data => res.json(data));
})

// save answers (create, update or delete)
app.put("/section/:sectionId/question/:questionId/answer", async (req, res) => {
  const answers = req.body.answers;
  for (const answer of answers) {
    answer.questionId = parseInt(req.params.questionId);
  }

  const original = await answerController.getAnswers(req.params.questionId);
  let created = [], deleted = [], updated = [];

  // find created
  created = answers.filter(a => !a.id);
  if (created.length) {
    created = await answerController.createAnswers(created);
  }

  // find deleted
  deleted = onlyInLeft(original, answers, isSameAnswer);
  if (deleted.length) {
    const resD = await answerController.deleteAnswers(deleted.map(d => d.id));
  }

  // find updated/existing
  updated = answers.filter(a => a.id);
  if (updated.length) {
    updated = await answerController.updateAnswers(updated);
  }

  return res.json(updated.concat(created));
})

// Limit 1 user answer per minute
const userAnswerLimiter = rateLimit({
  windowMs: 1000 * 60, // 1 minutes
  max: 1, // Limit each IP to 1 requests per `window`
  message: 'Preveliko število odgovorov, poskusite zopet kasneje.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// save user answer
app.put("/section/:sectionId/question/:questionId/answer/count", userAnswerLimiter, async (req, res) => {
  const answerIds = req.body.answers;
  const original = await answerController.getAnswers(req.params.questionId);
  const answersData = [];
  for (const answer of original) {
    if (answerIds.findIndex(id => id === answer.id) >= 0) {
      answersData.push({
        id: answer.id,
        questionId: parseInt(answer.questionId),
        count: answer.count + 1
      });
    }
  }
  answerController.incrementAnswers(answersData).then(data => res.json(data));
})

const isSameAnswer = (a, b) => a.id === b.id;

const onlyInLeft = (left, right, compareFunction) =>
  left.filter(leftValue =>
    !right.some(rightValue =>
      compareFunction(leftValue, rightValue)));

// TODO: remove
// // create answer in question by question id
// app.post("/section/:sectionId/question/:questionId/answer", async (req, res) => {
//   const data = {
//     ...req.body.answer,
//     questionId: req.params.questionId,
//   }
//   // check and fill missing order number
//   if (!data.order) {
//     const answers = await answerController.getAnswers(req.params.questionId);
//     const max = Math.max(...answers.map(a => a.order));
//     data.order = max + 1;
//   }
//   answerController.createAnswer(data).then(data => res.json(data));
// })
//
// // update answer
// app.put("/section/:sectionId/question/:questionId/answer/:answerId", (req, res) => {
//   const data = {
//     ...req.body.answer,
//     questionId: req.params.questionId,
//     id: req.params.answerId,
//   }
//   answerController.updateAnswer(data).then(data => res.json(data));
// })
//
// // delete answer
// app.delete("/section/:sectionId/question/:questionId/answer/:answerId", (req, res) => {
//   answerController.deleteAnswer(req.params.answerId).then(data => res.json(data));
// })

module.exports = app;
