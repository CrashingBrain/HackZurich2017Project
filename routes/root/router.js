/** @module root/router */
'use strict';

/* Imports */
const express = require('express');
const router = express.Router();

/* Supported methods */
//TODO

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
