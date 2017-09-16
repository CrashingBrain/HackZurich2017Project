/*  API utils */
/*
* functions to get stuff from the API
*/


	const utils = require('./utils');
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

	//TODO maybe implemnt images
