/** @module room/router */
'use strict';

/* Imports */
const express = require('express');
const middleware = require('../middleware');
const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const Post = mongoose.model('Post');
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

/* Room id, post comment to that room*/
router.post('/:room_id', function(req, res, next) {
  var newPost = new Post(req.body);
  if (ObjectId.isValid(req.params.room_id)) {
    // if true then post is a reply to another post
    // add as reply of parent
    if (newPost.parent) 
    {
      Post.findById(parent).exec(function(err, post){
        if (err) return next(err);
        if (!post) {
          res.status(404).json({
            message: "Trying to reply to a non-existent post."
          });
        } else {
          // save new post
          newPost.save(function(err, saved) {
            if (err) {
              res.status(400).json({
                message: "Error saving new post."
              });
            } else {
              // now save child into parent
              post.children.push(saved._id);
              post.save(function(err, saved) {
                if (err) {
                  res.status(400).json({
                    message: "Could not save Post in parent post."
                  });
                } else {
                  res.status(201).json(saved);
                }
              });
            }
          });
        }
      });
    } else {
      // no parent. then it's not a reply to another post
      newPost.save(function(err, saved){
        if (err) {
          res.status(400).json({
            message: "Error saving new post."
          });
        } else {
          // post saved in DB, now add it to the room.
          Room.findById(req.params.room_id).exec(function(err, room){
            room.posts.push(saved._id);
            room.save(function(err, updatedRoom){
              if (err){
                res.status(400).json({
                  message: "Could not save Post in Room. "
                });
              } else {
                res.status(201).json(updatedRoom);
              }
            });
          });
        }
      });
    }
  }
});

/* Export router for room */
module.exports = router;
