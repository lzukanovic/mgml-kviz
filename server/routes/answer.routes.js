const express = require('express');
const bodyParser = require('body-parser');
const answerController = require('../controller/answer.controller')
const questionController = require('../controller/question.controller')
const rateLimit = require("express-rate-limit");
const {authJwt} = require("../middleware");
const fileUpload = require('express-fileupload');

const app = express();
app.use(bodyParser.json());
app.use(fileUpload({}));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/*
* {{ Public API }}
* get all answers by section id and question id
*/
app.get("/section/:sectionId/question/:questionId/answer",
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.questionId))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await answerController.getAnswers(req.params.questionId);
      return res.status(200).json(fetch);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri pridobivanju odgovorov.', ...err});
    }
  }
)

/*
* get answer by id
*/
app.get("/section/:sectionId/question/:questionId/answer/:answerId",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.answerId))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await answerController.getAnswer(req.params.answerId);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri pridobivanju odgovora.', ...err});
    }

    // check if anything found
    if (fetch == null) {
      return res.status(404).json({message: 'Odgovor ne obstaja'});
    } else {
      return res.status(200).json(fetch);
    }
  }
)

/*
* save answers (create, update or delete)
*/
app.put("/section/:sectionId/question/:questionId/answer",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    const answers = JSON.parse(req.body.answers);

    for (const answer of answers) {
      answer.questionId = parseInt(req.params.questionId);

      // check for not null requirements
      if ((!(answer.text && answer.text.length) && !answer.image) || isNaN(parseInt(answer.order)) || isNaN(answer.questionId)) {
        return res.status(400).json({message: 'Neveljavni podatki'});
      }

      // set image data
      if (req.files && req.files['image'+answer.id]) {
        answer.imageName = req.files['image'+answer.id].name;
        answer.imageType = req.files['image'+answer.id].mimetype;
        answer.imageData = req.files['image'+answer.id].data;
      } else {
        answer.imageName = null;
        answer.imageType = null;
        answer.imageData = null;
      }
    }

    const original = await answerController.getAnswers(req.params.questionId);
    let created = [], deleted = [], updated = [];

    // find created
    created = onlyInLeft(answers, original, isSameAnswer);
    // reset any temporary ids
    created.forEach(c => c.id = null);
    try {
      if (created.length) {
        created = await answerController.createAnswers(created);
      }
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri ustvarjanju novih odgovorov.', ...err});
    }

    // find deleted
    deleted = onlyInLeft(original, answers, isSameAnswer);
    try {
      if (deleted.length) {
        const resD = await answerController.deleteAnswers(deleted.map(d => d.id));
      }
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri brisanju odgovorov.', ...err});
    }

    // find updated/existing
    updated = answers.filter(a => a.id);
    try {
      if (updated.length) {
        updated = await answerController.updateAnswers(updated);
      }
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri posodabljanju odgovorov.', ...err});
    }

    return res.json(updated.concat(created));
  }
)

// Limit 1 user answer per minute
const userAnswerLimiter = rateLimit({
  windowMs: 1000 * 60, // 1 minutes
  max: 3, // Limit each IP to 1 requests per `window`
  message: 'Preveliko število odgovorov, poskusite zopet kasneje.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


/*
* {{ Public API }}
* save user answer
*/
app.put("/section/:sectionId/question/:questionId/answer/count",
  userAnswerLimiter,
  async (req, res) => {
    // check for not null requirements
    if (isNaN(parseInt(req.params.questionId)) || !req.body.answers.length) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    const answerIds = req.body.answers;

    // check if question type matches number of answers
    const question = await questionController.getQuestion(req.params.questionId);
    if (question.type === 'singleChoice' && answerIds.length > 1) {
      return res.status(400).json({message: 'Dovoljen samo en odgovor!'});
    }

    // increment answers
    const originalAnswers = await answerController.getAnswers(req.params.questionId);
    const answersData = [];
    for (const answer of originalAnswers) {
      if (answerIds.findIndex(id => id === answer.id) >= 0) {
        answersData.push({
          id: answer.id,
          questionId: parseInt(answer.questionId),
          count: parseInt(answer.count) + 1
        });
      }
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await answerController.incrementAnswers(answersData);
      return res.status(200).json(fetch);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri posodabljanju odgovorov na vprašanje.', ...err});
    }
  }
)

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
