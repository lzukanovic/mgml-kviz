const express = require('express');
const bodyParser = require('body-parser');
const sectionController = require('../controller/section.controller')

const app = express();
app.use(bodyParser.json());

/*
* get all sections
*/
app.get("/section", (req, res) => {
  let queryParams = [];
  if (req.query.sort) {
    queryParams = req.query.sort.split(':');
  }
  sectionController.getSections(queryParams).then(data => res.json(data));
})

/*
* get section by id
*/
app.get("/section/:id", async (req, res) => {
  // check for invalid id
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({message: 'Neveljavni podatki'});
  }

  // check for exception while accessing DB
  let fetch = {}
  try {
    fetch = await sectionController.getSection(req.params.id);
  } catch (err) {
    return res.status(500).json({message: 'Napaka pri pridobivanju.', ...err});
  }

  // check if anything found
  if (fetch == null) {
    return res.status(404).json({message: 'Sekcija ne obstaja'});
  } else {
    return res.status(200).json(fetch);
  }
})

/*
* create section
*/
app.post("/section", async (req, res) => {
  // check for not null requirements
  const title = req.body.section?.title;
  if (!title || !title.length) {
    return res.status(400).json({message: 'Neveljavni podatki'});
  }

  // check for exception while accessing DB
  try {
    const fetch = await sectionController.createSection(req.body.section);
    return res.status(200).json(fetch);
  } catch (err) {
    return res.status(500).json({message: 'Napaka pri ustvarjanju.', ...err});
  }
})

/*
* update section
*/
app.put("/section", async (req, res) => {
  // check for not null requirements
  console.log(req.body)
  const id = parseInt(req.body.section?.id);
  const title = req.body.section?.title;
  if (isNaN(id) || !title || !title.length) {
    return res.status(400).json({message: 'Neveljavni podatki'});
  }

  // check for exception while accessing DB
  let fetch = {}
  try {
    fetch = await sectionController.updateSection(req.body.section);
  } catch (err) {
    return res.status(500).json({message: 'Napaka pri posodabljanju.', ...err});
  }

  // check if successful update
  if (fetch && fetch[0] === 1) {
    return res.status(200).json(fetch);
  } else {
    return res.status(404).json({message: 'Sekcija ne obstaja'});
  }
})

/*
* delete section
*/
app.delete("/section/:id", async (req, res) => {
  // check for invalid id
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({message: 'Neveljavni podatki'});
  }

  // check for exception while accessing DB
  let fetch = {}
  try {
    fetch = await sectionController.deleteSection(req.params.id);
  } catch (err) {
    return res.status(500).json({message: 'Napaka pri brisanju.', ...err});
  }

  // check if successful delete
  if (fetch && fetch[0] === 1) {
    return res.status(200).json(fetch);
  } else {
    return res.status(404).json({message: 'Sekcija ne obstaja'});
  }
})

module.exports = app;
