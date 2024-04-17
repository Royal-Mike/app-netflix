const express = require('express');
const router = express.Router();
const subscribeC = require('../controllers/subscribe.c');

router.get('/', subscribeC.getSubscribePage);
router.get('/process', subscribeC.processSubscription);
router.get('/trial', subscribeC.processTrial);
router.get('/activate', subscribeC.activateSubscription);
//
module.exports = router;
