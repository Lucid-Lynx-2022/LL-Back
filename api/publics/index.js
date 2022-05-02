const router = require('express').Router();
const controller = require('./publics.controller');

router.get('/', controller.getAllPublics);


module.exports = router;