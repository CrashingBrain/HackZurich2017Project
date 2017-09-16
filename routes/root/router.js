/** @module root/router */
'use strict';

/* Imports */
const express = require('express');
const middleware = require('../middleware');

/* Create router */
const router = express.Router();

// TESTing
const utils = require('../utils');
const APIutils = require('../APIutils');

/* Supported methods */
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

/* Home */
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
  	// TESTing
  	var restURL = "http://rmb.reuters.com/rmd/rest/json/item?id=tag:reuters.com,2017:newsml_LYNXNPED8E1X3:1&channel=BEQ259&token=0Uar2fCpykUYW2I2MlJIwL+aykWfs2VN81kIX5wuiTI="; //only images
  	var restURL2 = "http://rmb.reuters.com/rmd/rest/json/item?id=tag:reuters.com,2017:newsml_KCN1BQ161:12&token=0Uar2fCpykXbX0cWkkmYwszpfU2YWqWh81kIX5wuiTI=";
  	var entitiesURL = "http://rmb.reuters.com/rmd/rest/json/itemEntities?id=tag:reuters.com,2017:newsml_KCN1BQ161:12&minScore=0.0&token=0Uar2fCpykUMsmzhXT7Na5rCbjxeKz1/81kIX5wuiTI="
  	utils.doJSONRequest('GET', entitiesURL, null, null, function(data){
  		console.log(data);
  		console.log(APIutils.getEntitiesNames(data));
  		// console.log(APIutils.getItemTitle(data));
  		// console.log(APIutils.getItemMetas(data));
  		// console.log(APIutils.getItemContents(data));
  	});
    res.render('index', {
      title: "Nepeta",
    });
  }
  else {
    res.sendStatus(404);
  }
});

/* Export router for root */
module.exports = router;
