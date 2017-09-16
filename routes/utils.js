/*  AJAX with XML converter*/


const parseString = require('xml2js').parseString;
const XMLHttpRequest = require('xhr2');
	

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
	module.exports.doXMLRequest = function doXMLRequest(method, url, headers, data, callback){

	  //all the arguments are mandatory
	  if(arguments.length != 5) {
	    throw new Error('Illegal argument count');
	  }

	  doRequestChecks(method, true, data);

	  //create an ajax request
	  const r = new XMLHttpRequest();

	  //open a connection to the server using method method on the url API
	  r.open(method, url, true);

	  //set the headers
	  doRequestSetHeaders(r, method, headers);

	  //wait for the response from the server
	  r.onreadystatechange = function () {
	    //correctly handle the errors based on the HTTP status returned by the called API
	    if (r.readyState != 4 || (r.status != 200 && r.status != 201 && r.status != 204)){
	      return;
	    } else {
	      if(isJSON(r.responseText))
	        callback(JSON.parse(r.responseText));
	      else {
	      		parseString(r.responseText, function (err, result) {
	      		    console.log(result.newsMessage.itemSet[0].newsItem[0].itemMeta[0].title[0]);
	      	  		callback(result);
	      		});
	      }

	    }
	  };

	  //set the data
	  let dataToSend = null;
	  if (!("undefined" == typeof data) 
	    && !(data === null))
	    dataToSend = JSON.stringify(data);

	  //console.log(dataToSend)

	  //send the request to the server
	  r.send(dataToSend);


	}

	/*
		Returns the title of an Item object as returned from a call of XMLRequest
	*/
	module.exports.getItemTitle = function(itemData){

		return itemData.newsMessage.itemSet[0].newsItem[0].itemMeta[0].title[0];

	}

	/*
		Returns relevant meta informations from an Item object as resulte from a call of XMLRequest
	*/
	module.exports.getItemMetas = function(itemData){
		var newsObject = {
			"headline"	: itemData.newsMessage.itemSet[0].newsItem[0].contentMeta[0].headline[0],
			"dateline"	: itemData.newsMessage.itemSet[0].newsItem[0].contentMeta[0].dateline[0],
			"by"				: itemData.newsMessage.itemSet[0].newsItem[0].contentMeta[0].by[0],
			"description"	: itemData.newsMessage.itemSet[0].newsItem[0].contentMeta[0].description[0]
		}

		return newsObject;
	}

	/*
		Returns relevant contents from an Item object as resulte from a call of XMLRequest
	*/
	module.exports.getItemContents = function(itemData){
		// for test article the cntent is saved as an array of lines, so each element of the array 'body[0].p' (from tag 'p') is a string
		var stringedHTML = JSON.stringify(itemData.newsMessage.itemSet[0].newsItem[0].contentSet[0].inlineXML[0].html[0].body[0]);
		var newsObject = {
			"content"	: stringedHTML
		}

		return newsObject;
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

function doRequestSetHeaders(r, method, headers){

	  //set the default JSON header according to the method parameter
	  // r.setRequestHeader("Accept", "application/json");

	  if(method === "POST" || method === "PUT"){
	    r.setRequestHeader("Content-Type", "application/json");
	  }

	  //set the additional headers
	  if (!("undefined" == typeof headers) 
	    && !(headers === null)){

	    for(header in headers){
	      //console.log("Set: " + header + ': '+ headers[header]);
	      r.setRequestHeader(header,headers[header]);
	    }

	  }
	}

	function doRequestChecks(method, isAsynchronous, data){

	  //verify the request method
	  if(method!="GET" && method!="POST" && method!="PUT" && method!="DELETE") {
	    throw new Error('Illegal method: ' + method + ". It should be one of: GET, POST, PUT, DELETE.");
	  }

	  //verify the data parameter
	  if (!("undefined" == typeof data) 
	    && !(data === null))
	    if(!canJSON(data)) {
	      throw new Error('Illegal data: ' + data + ". It should be an object that can be serialized as JSON.");
	    }
	  }