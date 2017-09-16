/*  AJAX with XML converter*/


const parseString = require('xml2js').parseString;
const XMLHttpRequest = require('xhr2');
const APIutils = require('./APIutils')
const config = require('../config');
const mongoose = require('mongoose');
mongoose.connect(config.mongoUrl + config.mongoDbName);
require ('../models/models');
const Room = mongoose.model('Room');

	/*
		Does an Ajax request expecting an XML response but converts it to JSON and parse it to the callback.
	*/
	/*
	 * @param {String} method The method of the AJAX request. One of: "GET", "POST", "PUT", "DELETE".
	 * @param {String} url The url of the API to call, optionally with parameters.
	 * @param {Object} headers The Associative Array containing the Request Headers. It must be null if there are no headers.
	 * @param {JSON} data The data in the JSON format to be sent to the server. It must be null if there are no data.
	 * @param {Function} callback The function to call when the response is ready.
	 */

	module.exports.doJSONRequest = function doJSONRequest(method, url, headers, data, callback) {
    let request = new XMLHttpRequest();
	request.open(method, url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			switch (request.status) {
				case 200:
				case 201:
					callback(JSON.parse(request.responseText));
					break;
				case 205:
					callback(request.responseText);
					break;
				default:
					console.log(request.status);
					callback(request.status, true);
			}
		}
	};

	request.setRequestHeader("Accept", "application/json");

	// if header is null, do not set anything
	if (headers != null && (method === "POST" || method === "PUT")) {
		request.setRequestHeader("Content-Type", "application/json");
	}

	// add custom headers
	if (headers) {
    for (header in headers) {
			request.setRequestHeader(`${header}`, `${headers[header]}`);
		}
  }

	if(headers == null) {
		request.send(data)
	} else {
		// send body data
		request.send(JSON.stringify(data));
	}
}

function areCommonEntities(mainItem, newItem, lim){
	APIutils.doEntitiesRequest(mainItem, function(mainEntities){
		var mainNames = APIutils.getEntitiesNames(mainEntities);
		APIutils.doEntitiesRequest(newItem, function(newEntities){
			var newNames = APIutils.getEntitiesNames(newEntities);
			if (mainEntities.filter((n) => newEntities.includes(n)).length >= lim){
				return true;
			} else {
				return false;
			}
		});
	});
}

module.exports.demuxItem = function(item){
	var itemId = item.uri;

	Room.find({}, function(err, rooms) {
    if (err) {
      console.log("error finding rooms: " + err);
    } else {
      for(let room of rooms){
      	// only check for common entities in the first room.items
      	// as it was the original article tha topened the room
      	// this to avoid the room to diverge too much from initial topic
      	// intersection_treshold is the number of minimun common entities to consider it part of the same news stream
      	var intersection_treshold = 5;
      	if (areCommonEntities(room.items[0], item, intersection_treshold)) {
      		room.items.push(item);
      		room.save(function(err, saved){
      			if(err){
      				console.log('error demuxing an Item: '+ err);
      			} else {
      				console.log('Item entered in ' + saved.headline);
      			}
      		});
      	} else {
      		console.log('creating new room...');
      		module.exports.openRoom(item);
      	}
      }
    }
  });

}

/* Internal functions */

function canJSON(value) {
	  try {
	    const jsonString = JSON.stringify(value);
	    if (!("undefined" == typeof jsonString)
	      && !(jsonString === null)
	      && !(jsonString == typeof String))
	      return true;
	    else
	      return false;
	  } catch (ex) {
	    return false;
	  }
	}

function isJSON(jsonString){

	  try {
	    const o = JSON.parse(jsonString);

	    if (o && typeof o === "object" && o !== null) {
	      return true;
	    }
	  }
	  catch (e) {}

	  return false;
	}

// utility for tags
Array.prototype.byCount= function(){
    var itm, a= [], L= this.length, o= {};
    for(var i= 0; i<L; i++){
        itm= this[i];
        if(!itm) continue;
        if(o[itm]== undefined) o[itm]= 1;
        else ++o[itm];
    }
    for(var p in o) a[a.length]= p;
    return a.sort(function(a, b){
        return o[b]-o[a];
    });
}

// we store the ids of all news items we have in the db also in the `newsItems` object for efficient lookup, no need to query db
const newsItems = {}; // newsItemID : {room, version}

// loads all news items from all rooms into newsItems
module.exports.seedNewsItems = () => {
  Room.find({}, function(err, room) {
    if (err) {
      console.log("error finding rooms: " + err);
    } else if (room && room.items) {
      for(let newsItem of room.items)
        newsItem[newsItem.uri] = room._id;
    }
  });
}

module.exports.getDuplicateNewsItem = (newsItemID) => {
  return newsItems[newsItemID];
}

module.exports.openRoom = (newsItem) => {
  // get the tags for this room
  APIutils.doEntitiesRequest(newsItem.versionedguid, (entities, err) => {
  	if(err){
  		console.log('error retrieving room tags: ', err);
  	} else {
  		let tags = APIutils.getEntitiesNames(entities);
      let room = new Room(newsItem);
      room.items = [newsItem];
  		room.tags = tags;

      room.save(function(err, saved) {
        if (err) {
          console.log('error saving room: ', err);
        }
        else {
          newsItems[newsItem.uri] = { room: saved._id,
                                      version: newsItem.version };
          console.log('saved news item:', saved.headline, newsItem.uri);
        }
      });
  	}
  });
}
