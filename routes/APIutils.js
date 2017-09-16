/*  API utils */
/*
* functions to get stuff from the API
*/


const moment = require('moment');
const utils = require('./utils');
const config = require('../config');
/*
	Returns the title of an Item object as returned from a call of XMLRequest as JSON
*/
module.exports.getItemTitle = function(itemData){

	return itemData.headline;

}

/*
	Returns relevant meta informations from an Item object as resulte from a call of XMLRequest  as JSON
*/
module.exports.getItemMetas = function(itemData){
	var newsObject = {
		"headline"	: itemData.headline,
		"dateline"	: itemData.dateline,
		"by"				: itemData.byline,
		"description"	: itemData.caption
	}

	return newsObject;
}

/*
	Returns relevant contents from an Item object as resulte from a call of XMLRequest as JSON
*/
module.exports.getItemContents = function(itemData){
	return itemData.body_xhtml;
}

/*
	Returns array of entities(names) from an entities object as result from a call of XMLRequest as JSON
*/
module.exports.getEntitiesNames = function(entitiesData){
	var names = [];
	for (let entity of entitiesData.items[0].entities) {
		if(entity.vtype === "ENTITY") {
			names.push(entity.name);
		}
	}
	return names;
}

/* Given an Item Id performs request for its entities
returns array of entities
*/
module.exports.doEntitiesRequest = function(itemId, callback){
	var url = "http://rmb.reuters.com/rmd/rest/xml/itemEntities?id=" + itemId +"&minScore=0.0&token=0Uar2fCpykUMsmzhXT7Na5rCbjxeKz1/81kIX5wuiTI=";
	utils.doJSONRequest('GET', url, null, null, callback);
}

// Get poll token for subsequent real time item requests
// (see reuters docs @ 4.2.2)
function getPollToken(callback) {
  let now = moment().format('YYYY.MM.DD.hh.mm');
  let aMinuteAgo =  moment().utc().subtract(1, 'hour').format('YYYY.MM.DD.hh.mm');
  let pollingUrl = 'http://rmb.reuters.com/rmd/rest/xml/items?channel=STK567&dateRange=' + aMinuteAgo + '&token=' + config.reutersToken;
  utils.doJSONRequest('GET', pollingUrl, null, null, callback);
}

// Get news items using periodic polling key
function getPeriodicItems(pollToken) {
  console.log('polling...');
  let pollingUrl = 'http://rmb.reuters.com/rmd/rest/xml/items?channel=STK567&token=' + config.reutersToken + '&pollToken=' + pollToken;
  utils.doJSONRequest('GET', pollingUrl, null, null, function(data) {
		console.log(data);
    console.log(data.results.result[0]);
    for(let newsItem of data.results.result)
      if(!utils.isDuplicateNewsItem(newsItem.id[0])) {
        // TODO check common topic and put in existing room
        // or
        utils.openRoom(newsItem);
      }
	});
}

// periodically make a news items request
module.exports.pollRecentNews = function(pollingTimeMs) {
  utils.seedNewsItems();

  getPollToken(function(data) {
    let pollToken = data.results.pollToken;

    setInterval(
      () => getPeriodicItems(pollToken),
      pollingTimeMs
    );
  })
}




//TODO maybe implemnt images
