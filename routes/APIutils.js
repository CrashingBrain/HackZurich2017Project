/*  API utils */
/* 
* functions to get stuff from the API
*/

	/*
		Returns the title of an Item object as returned from a call of XMLRequest as XML
	*/
	module.exports.getItemTitle = function(itemData){

		return itemData.newsMessage.itemSet[0].newsItem[0].itemMeta[0].title[0];

	}

	/*
		Returns relevant meta informations from an Item object as resulte from a call of XMLRequest  as XML
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
		Returns relevant contents from an Item object as resulte from a call of XMLRequest as XML
	*/
	module.exports.getItemContents = function(itemData){
		// for test article the cntent is saved as an array of lines, so each element of the array 'body[0].p' (from tag 'p') is a string
		var stringedHTML = JSON.stringify(itemData.newsMessage.itemSet[0].newsItem[0].contentSet[0].inlineXML[0].html[0].body[0]);
		var newsObject = {
			"content"	: stringedHTML
		}

		return newsObject;
	}

	/*
		Returns array of entities(names) from an entities object as result from a call of XMLRequest as JSON
	*/

	module.exports.getEntitiesNames = function(entitiesData){
		var names = [];
		for (var i = entitiesData.items[0].entities.length - 1; i >= 0; i--) {
			if(entitiesData.items[0].entities[i].vtype === "ENTITY") {
				names.push(entitiesData.items[0].entities[i].name);
			}
		}
		return names;
	}


	//TODO maybe implemnt images