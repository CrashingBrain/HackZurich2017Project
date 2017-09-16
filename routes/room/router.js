/** @module room/router */
'use strict';

/* Imports */
const express = require('express');
const middleware = require('../middleware');

/* Create router */
const router = express.Router();

/* Supported methods */
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

/* Room no id, return nothing */
router.get('/', function(req, res, next) {
  res.text("No room specified").status(404).end();
});

/* Room id, return that room */
router.get('/:roomid', function(req, res, next) {
  if (req.accepts('text/html')) {
    res.render('room', {
      title : "Nepeta"
    });
  }
});

/* Export router for room */
module.exports = router;
