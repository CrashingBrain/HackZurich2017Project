/* Wikimedia API utils */


doWikiExtractRequest = function(pagetitle, callback){
	let url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + pagetitle;

	ajaxRequest('GET', url, null, null, callback);
}