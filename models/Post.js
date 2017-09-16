/** @module models/Post
* The Post Model
* Schema:
* username					String			  name of the posting user
* message				    String			  actual post message
* date              Date          date when the post was added
* room              ObjectID      Room on which this message is posted
* children          [ObjectID]    all replies to this Post (other Post objs)
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Room');

const Post = exports.Claim = new mongoose.Schema({
  username :        { type : String, default : "anon" },
  message :         { type : String, required : true },
  date :            { type : Date, default : Date.now() },
  replies :         [{ type : ObjectID, default : [] }],
  parent: 				  { type: ObjectID, ref: 'Post' },
});

Post.post('validate', function(doc) {
  if (doc.username === "anon") {
    doc.username = "anon" + Math.floor(Math.random()*100000000000);
  }
});

/* Register model for schema */
mongoose.model('Post', Post);
