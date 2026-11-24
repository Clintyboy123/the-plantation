// Public: the specials visitors see on the Weddings page.
const router = require('express').Router();
const controller = require('../controllers/special.controller');

router.get('/', controller.listLive);

module.exports = router;
