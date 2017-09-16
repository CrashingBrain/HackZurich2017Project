/** @module room/router */
'use strict';

/* Imports */
const express = require('express');
const middleware = require('../middleware');
const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const ObjectId = mongoose.Types.ObjectId;

/* Create router */
const router = express.Router();

/* Supported methods */
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

/* Room no id, return nothing */
router.get('/', function(req, res, next) {
  res.text("No room specified").status(404).end();
});

/* Room id, return that room */
router.get('/:room_id', function(req, res, next) {
  /* If bad ID return */
  if (!ObjectId.isValid(req.params.room_id)) {
    res.sendStatus(400);
  }
  /* Get room  and populate data */
  else if (req.accepts('text/html')) {
    Room.findById(req.params.room_id)
    .populate('posts')
    .exec(function(err, room_data) {
      if (err) {
        res.sendStatus(500);
      }
      else if (room_data) {
        res.render('room', {
          title : "Nepeta",
          roomstring : JSON.stringify(room_data),
        });
      }
      else res.sendStatus(404);
    });
  }
  /* If bad accepts return */
  else {
    res.sendStatus(400);
  }
});

/* Export router for room */
module.exports = router;
