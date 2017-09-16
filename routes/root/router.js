/** @module root/router */
'use strict';

/* Imports */
const express = require('express');
const router = express.Router();

// TESTing
const ajax = require('../utils');

/* Supported methods */
//TODO

/* Home */
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
  	// TESTing
  	var restURL = "http://rmb.reuters.com/rmd/rest/xml/item?id=tag:reuters.com,2017:newsml_LYNXNPED8E1X3:1&channel=BEQ259&token=0Uar2fCpykUYW2I2MlJIwL+aykWfs2VN81kIX5wuiTI=";
  	ajax.doXMLRequest('GET', restURL, null, null, function(data){
  		console.log(data);
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
