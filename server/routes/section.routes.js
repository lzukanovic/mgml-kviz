const express = require('express');
const bodyParser = require('body-parser');
const sectionController = require('../controller/section.controller');
const { authJwt } = require("../middleware");

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
* get all sections
*/
app.get("/section",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  (req, res) => {
    let queryParams = [];
    if (req.query.sort) {
      queryParams = req.query.sort.split(':');
    }
    sectionController.getSections(queryParams).then(data => res.json(data));
  }
)

/*
* get section by id
*/
app.get("/section/:id",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.id))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await sectionController.getSection(req.params.id);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri pridobivanju sekcije.', ...err});
    }

    // check if anything found
    if (fetch == null) {
      return res.status(404).json({message: 'Sekcija ne obstaja'});
    } else {
      return res.status(200).json(fetch);
    }
  }
)

/*
* create section
*/
app.post("/section",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
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
      return res.status(500).json({message: 'Napaka pri ustvarjanju sekcije.', ...err});
    }
  }
)

/*
* update section
*/
app.put("/section/:id",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for not null requirements
    const data = {
      ...req.body.section,
      id: req.params.id,
    }
    if (isNaN(parseInt(data.id)) || !data.title || !data.title.length) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await sectionController.updateSection(data);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri posodabljanju sekcije.', ...err});
    }

    // check if successful update
    if (fetch && fetch[0] === 1) {
      return res.status(200).json(fetch);
    } else {
      return res.status(404).json({message: 'Sekcija ne obstaja'});
    }
  }
)

/*
* delete section
*/
app.delete("/section/:id",
  (req, res, next) => authJwt.verifyToken(req, res, next),
  async (req, res) => {
    // check for invalid id
    if (isNaN(parseInt(req.params.id))) {
      return res.status(400).json({message: 'Neveljavni podatki'});
    }

    // check for exception while accessing DB
    let fetch = {}
    try {
      fetch = await sectionController.deleteSection(req.params.id);
    } catch (err) {
      return res.status(500).json({message: 'Napaka pri brisanju sekcije.', ...err});
    }

    // check if successful delete
    if (fetch === 1) {
      return res.status(200).json(fetch);
    } else {
      return res.status(404).json({message: 'Sekcija ne obstaja'});
    }
  }
)

module.exports = app;
