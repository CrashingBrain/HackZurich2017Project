/* Wikimedia API utils */

const moment = require('moment');
const utils = require('./utils');
const config = require('../config');

module.exports.doWikiExtractRequest = function(pagetitle, callback){
	let url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + pagetitle;

	utils.doJSONRequest('GET', url, null, null, callback);
}