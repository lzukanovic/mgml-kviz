const express = require('express');
const bodyParser = require('body-parser');
const sectionController = require('../controller/section.controller')

const app = express();
app.use(bodyParser.json());

// request to get all the users
app.get("/section", (req, res) => {
  sectionController.getSections().then(data => res.json(data));
})

module.exports = app;
