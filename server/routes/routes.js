const express = require("express");
const router = express();

router.use("", require('./section.routes'));
router.use("", require('./question.routes'));

module.exports = router;
