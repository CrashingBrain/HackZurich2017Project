/** @module models/models.js
* Loads all models
*/
'use strict';

var mongoose = require('mongoose');

require('./Post');
require('./Room');

module.exports = {
	'Post'         : mongoose.model('Post'), //TODO create and register model
	'Room'         : mongoose.model('Room'), //TODO create and register model
}
