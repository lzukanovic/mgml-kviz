const express = require('express');
const bodyParser = require('body-parser');
const sectionController = require('../controller/section.controller')

const app = express();
app.use(bodyParser.json());

// get all sections
app.get("/section", (req, res) => {
  let queryParams = [];
  if (req.query.sort) {
    queryParams = req.query.sort.split(':');
  }
  sectionController.getSections(queryParams).then(data => res.json(data));
})

// get section by id
app.get("/section/:id", (req, res) => {
  sectionController.getSection(req.params.id).then(data => res.json(data));
})

// create section
app.post("/section", (req, res) => {
  sectionController.createSection(req.body.section).then(data => res.json(data));
})

// update section
app.put("/section", (req, res) => {
  sectionController.updateSection(req.body.section).then(data => res.json(data));
})

// delete section
app.delete("/section/:id", (req, res) => {
  sectionController.deleteSection(req.params.id).then(data => res.json(data));
})

module.exports = app;
