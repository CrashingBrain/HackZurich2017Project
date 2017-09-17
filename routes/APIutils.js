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
module.exports.getItemMetas = function(itemData) {
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
module.exports.getEntitiesNames = function(entitiesData) {
  if(!entitiesData) return [];
	var names = [];
	for (let entity of entitiesData.items[0].entities) {
		if(entity.vtype === "ENTITY") {
			names.push(entity.name);
		}
	}
	return names;
}

module.exports.getLocationEntity = function(entitiesData) {
  if(!entitiesData) return null;

  let maxRelevancy = 0.0;
  let mostRelevantLocation = 'Earth';

  for (let entity of entitiesData.items[0].entities) {
		if(entity.vtype === "ENTITY"
      && entity.type === 'http://s.opencalais.com/1/type/er/Geo/City'
      && entity.relevancy > maxRelevancy) {
        maxRelevancy = entity.relevancy;
        mostRelevantLocation = entity.name;
		}
	}

  return mostRelevantLocation;
}

/* Given an Item Id performs request for its entities
returns array of entities
*/
module.exports.doEntitiesRequest = function(itemId, callback){
	var url = "http://rmb.reuters.com/rmd/rest/json/itemEntities?id=" + itemId +"&minScore=0.0" + '&token=' + config.reutersToken;
	utils.doJSONRequest('GET', url, null, null, callback);
}

/* Given an Item Id performs request for Persons entity in the item
*/
module.exports.doPersonEntityRequest = function(itemId, callback){
	var url = "http://rmb.reuters.com/rmd/rest/json/itemEntities?" + itemId +"&type=http://s.opencalais.com/1/type/em/e/Person&minScore=0.0" + '&token=' + config.reutersToken;
	utils.doJSONRequest('GET', url, null, null, callback);
}

// Get poll token for subsequent real time item requests
// (see reuters docs @ 4.2.2)
function getPollToken(callback) {
  let aMinuteAgo =  moment().utc().subtract(1, 'minute').format('YYYY.MM.DD.HH.mm');
  console.log('retrieving polling token...');
  let pollingUrl = 'http://rmb.reuters.com/rmd/rest/json/items?channel=FES376&mediaType=T&dateRange=' + aMinuteAgo + '&token=' + config.reutersToken;
  utils.doJSONRequest('GET', pollingUrl, null, null, callback);
}

// Get news items using periodic polling key
function getPeriodicItems(pollToken) {
  console.log('polling...');
  let pollingUrl = 'http://rmb.reuters.com/rmd/rest/json/items?channel=FES376&mediaType=T&token=' + config.reutersToken + '&pollToken=' + pollToken;
  utils.doJSONRequest('GET', pollingUrl, null, null, demuxNewsItems);
}

// periodically make a news items request
module.exports.pollRecentNews = function(pollingTimeMs) {
  utils.seedNewsItems();

  getPollToken(function(data, error) {
    if(error) return;
    let pollToken = data.pollToken;
    demuxNewsItems(data);
    setInterval(
      () => getPeriodicItems(pollToken),
      pollingTimeMs
    );
  })
}

function processQueueItem(itemsQueue) {
  if(itemsQueue.length == 0) return;
  let newsItem = itemsQueue[0];
  itemsQueue.splice(0, 1);

  let existing = utils.getDuplicateNewsItem(newsItem.guid);
  let itemUrl = 'http://rmb.reuters.com/rmd/rest/json/item?id=' + newsItem.id + '&channel=FES376&token=' + config.reutersToken;
  // if new article
  if(!existing) {
    utils.doJSONRequest('GET', itemUrl, null, null, function(item, error) {
      if(!error) {
        // check common tags and either put in existing room or create new one
        utils.demuxItem(item);
      }
      processQueueItem(itemsQueue);
    });
      // if existing article
  } else if(existing.version < newsItem.version) {
    utils.doJSONRequest('GET', itemUrl, null, null, function(item, error) {
      if(!error) {
        // update room with latest version of this news item
        utils.updateNewsItem(item);
      }
      processQueueItem(itemsQueue);
    });
  } else {
    console.log('discarded duplicate', newsItem.guid);
    processQueueItem(itemsQueue);
  }
}
function demuxNewsItems(data, error) {
  if(error) return;
  console.log('number of news items: ', data.results.length);

  // if same news, keep highest version
  let items = data.results;
  for(let i = 0; i < items.length; i++) {
    for(let j = 0; j < items.length; j++) {
      if(i == j || !items[i] || !items[j]) continue;

      if(items[i].guid == items[j].guid) {
        if(items[i].version > items[j].version)
          items[j] = null;
        else
          items[i] = null;

        continue;
      }
    }
  }

  items = items.filter((item) => item != null );
  processQueueItem(items);
}
