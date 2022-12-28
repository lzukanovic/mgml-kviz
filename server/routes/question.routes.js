const express = require('express');
const bodyParser = require('body-parser');
const questionController = require('../controller/question.controller')
const {authJwt} = require("../middleware");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/*
* get all questions by section id
*/
app.get("/section/:sectionId/question",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.sectionId))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    let queryParams = [];
    if (req.query.sort) {
      queryParams = req.query.sort.split(':');
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await questionController.getQuestions(req.params.sectionId, queryParams);
      return res.status(200).json(fetch);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri pridobivanju vprašanj.', ...err});
    }
  }
)

/*
* {{ Public API }}
* get question by id
*/
app.get("/section/:sectionId/question/:questionId",
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.questionId))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await questionController.getQuestion(req.params.questionId);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri pridobivanju vprašanja.', ...err});
    }

    // check if anything found
    if (fetch == null) {
      return res.status(404).json({message: 'Vprašanje ne obstaja'});
    } else {
      return res.status(200).json(fetch);
    }
  }
)

/*
* create question in section by section id
*/
app.post("/section/:sectionId/question",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for not null requirements
    const data = {
      ...req.body.question,
      sectionId: req.params.sectionId,
    };
    if (!data.title || !data.title.length || !data.type || isNaN(parseInt(data.sectionId))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    try {
      const fetch = await questionController.createQuestion(data);
      return res.status(200).json(fetch);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri ustvarjanju vprašanja.', ...err});
    }
  }
)

/*
* update question
*/
app.put("/section/:sectionId/question/:questionId",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for not null requirements
    const data = {
      ...req.body.question,
      sectionId: req.params.sectionId,
      id: req.params.questionId,
    }
    if (isNaN(parseInt(data.id)) || isNaN(parseInt(data.sectionId)) || !data.title || !data.title.length || !data.type) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await questionController.updateQuestion(data);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri posodabljanju vprašanja.', ...err});
    }

    // check if successful update
    if (fetch && fetch[0] === 1) {
      return res.status(200).json(fetch);
    } else {
      return res.status(404).json({message: 'Vprašanje ne obstaja'});
    }
  }
)

/*
* delete question
*/
app.delete("/section/:sectionId/question/:questionId",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.questionId))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await questionController.deleteQuestion(req.params.questionId);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri brisanju vprašanja.', ...err});
    }

    // check if successful delete
    if (fetch === 1) {
      return res.status(200).json(fetch);
    } else {
      return res.status(404).json({message: 'Vprašanje ne obstaja'});
    }
  }
)

module.exports = app;
