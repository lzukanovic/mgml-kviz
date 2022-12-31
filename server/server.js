const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./logger/logger');
const { connect } = require("./config/db.config");
const rateLimit = require('express-rate-limit')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3070;

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
// Use CORS
app.use(cors())

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

(async () => {
  try {
    // create defined tables if not exist
    const db = connect();
    await db.sequelize.sync();

    // check if default account is added
    const account = await db.account.findOne({
      where: {
        username: 'admin'
      }
    });
    // add default account if not added
    if (!account) {
      await db.account.create({
        username: 'admin',
        hash: '6578b2b3a58ea42c6c53cbc7a42e110ee9662e731a01e74f3797c8bc26417a83c64881dabf20ca7c8fbf25cedda112389710fd739a7e8ee9e3bb755521eb6dcb',
        salt: '7c8f538a7e4b0badf6a07e33151633d5'
      });
    }

    // run server
    app.listen(port, () => {
      logger.info(`Server listening on the port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
