const express = require("express");
const router = express();

router.use("", require('./auth.routes'));
router.use("", require('./section.routes'));
router.use("", require('./question.routes'));
router.use("", require('./answer.routes'));

module.exports = router;
