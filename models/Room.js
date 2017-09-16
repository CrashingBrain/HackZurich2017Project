/** @module models/Room
* The Room Model
* Schema:
* headline					String			  name main argument of the room
* postsCount				Number			  number of post contained in room
* lastPost          Date          date of last post in the Room
* posts             [ObjectID]    posts contained in the room
* items		          [Object]    	array of news items contained in the room
* references        [Object]      array of references (news articles, videos...)
* tags							[Object]			array of all tags contained in the items, with frequencies, sorted
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Post');

const Room = exports.Claim = new mongoose.Schema({
  headline     :        { type : String, default : "Fake News" },
  postsCount	 :        { type : Number, default : 0 },
  lastPost     :        { type : Date, default : Date.now() },
  posts		     :        [{ type : ObjectID, ref:"Post"} ],
  items		     : 				{ type : Array, "default" : [] },
  references	 : 				{ type : Array, "default" : [] },
  tags		     : 				{ type : Array, "default" : [] },
});

Room.pre('save', function(next) {
  next();
});

/* Register model for schema */
mongoose.model('Room', Room);
