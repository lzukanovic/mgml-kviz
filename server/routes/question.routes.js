const express = require('express');
const bodyParser = require('body-parser');
const questionController = require('../controller/question.controller')

const app = express();
app.use(bodyParser.json());

// get all questions by section id
app.get("/section/:sectionId/question", (req, res) => {
  let queryParams = [];
  if (req.query.sort) {
    queryParams = req.query.sort.split(':');
  }
  questionController.getQuestions(req.params.sectionId, queryParams).then(data => res.json(data));
})

// get question by id
app.get("/section/:sectionId/question/:questionId", (req, res) => {
  questionController.getQuestion(req.params.questionId).then(data => res.json(data));
})

// create question in section by section id
app.post("/section/:sectionId/question", (req, res) => {
  const data = {
    ...req.body.question,
    sectionId: req.params.sectionId,
  }
  questionController.createQuestion(data).then(data => res.json(data));
})

// update question
app.put("/section/:sectionId/question/:questionId", (req, res) => {
  const data = {
    ...req.body.question,
    sectionId: req.params.sectionId,
    id: req.params.questionId,
  }
  questionController.updateQuestion(data).then(data => res.json(data));
})

// delete question
app.delete("/section/:sectionId/question/:questionId", (req, res) => {
  questionController.deleteQuestion(req.params.questionId).then(data => res.json(data));
})

module.exports = app;
