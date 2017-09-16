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
// require ('./Room'); //TODO implement Room

const Post = exports.Claim = new mongoose.Schema({
  // * username					String			  name of the posting user
  // * message				    String			  actual post message
  // * date              Date          date when the post was added
  // * room              ObjectID      Room on which this message is posted
  // * children          [ObjectID]    all replies to this Post (other Post objs)
	},
	{
		versionKey: false,
	}
);

/* Register model for schema */
mongoose.model('Post', Post);
