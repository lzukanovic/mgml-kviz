const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger/logger');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// General API call limiter for each user set to 1000 requests per 20 minutes
const limiter = rateLimit({
  windowMs: 1000 * 60 * 20, // 20 minutes
  max: 1000, // Limit each IP to 1000 requests per `window`
  message: 'Preveliko število zahtev, poskusite zopet kasneje.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Apply the rate limiting middleware to all requests
app.use(limiter);

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
