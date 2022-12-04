const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger/logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// default route
app.get("/", (req, res) => {
  res.send("App works!!");
});

// api routes
app.use("/api", require("./routes/routes"));

// request to handle undefined or all other routes
app.get("*", (req, res) => {
  logger.info("undefined route accessed");
  res.send("App works!!");
});

// run server
app.listen(port, () => {
  logger.info(`Server listening on the port: ${port}`);
});
