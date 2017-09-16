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
  var newsArray;
  Room.find({}, function(err, rooms) {
    for (room of rooms) {
      var news = {
        title : room.headline,
        postsCount : room.postsCount,
        lastPost : room.lastPost,
        tags : room.tags,
      }
      newsArray.description = room.items[0].replace(/<p>/g, '').replace(/</p>/g, '').replace(/' +'/g, ' ');
      rooms.push(news);
    }
    res.status(200).json({
      statusCode: 200,
      message: 'sucessfully retrieved news',
      data: newsArray
    }).end();
  });
});

/* Room id, return that room */
router.get('/:room_id', function(req, res, next) {
  /* If bad ID return */
  if (!ObjectId.isValid(req.params.room_id)) {
    //TODO correct, is fake
    res.render('room', {
      title : "Nepeta",
      // room : room_data
    });
    // res.sendStatus(400);
  }
  /* Get room  and populate data */
  else if (req.accepts('text/html')) {
    Room.findById(req.params.room_id)
    .populate('posts')
    .exec(function(err, room_data) {
      if (err) res.sendStatus(500);
      else if (room_data) res.render('room', {
        title : "Nepeta",
        room : room_data,
      });
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
