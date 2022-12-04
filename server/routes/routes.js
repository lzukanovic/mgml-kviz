const express = require("express");
const router = express();

router.use("", require('./section.routes'));

module.exports = router;
