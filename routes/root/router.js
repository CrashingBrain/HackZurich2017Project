/** @module root/router */
'use strict';

/* Imports */
const express = require('express');
const middleware = require('../middleware');

/* Create router */
const router = express.Router();

// TESTing
const utils = require('../utils');
const APIutils = require('../APIutils');

/* Supported methods */
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

/* Home */
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
    res.render('index', {
      title: "Nepeta",
    });
  }
  else {
    res.sendStatus(404);
  }
});

/* Export router for root */
module.exports = router;
