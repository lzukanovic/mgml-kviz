const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../controller/auth.controller')
const { verifySignUp } = require("../middleware");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// TODO: Development only
// app.post(
//   "/register",
//   (req, res, next) => verifySignUp.checkDuplicateUsername(req, res, next),
//   authController.register
// );

app.post("/login", authController.login);

module.exports = app;
