'use strict';

/* Imports */
var config = require('./config')
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dustjs = require('adaro');
var app = express();
var methodOverride = require('method-override');

/* Connect to MongoDB */
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl + config.mongoDbName);

/* Register model definition */
require('./models/models');
const APIutils = require('./routes/APIutils.js');

/* DustJS view engine setup */
app.engine('dust', dustjs.dust({ whitespace : true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

/* Configure app */
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());    // parse application/json
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

/* Initialize routers here */
var routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/room', routers.room);

// periodic polling
const POLLING_INTERVAL_MS = 10000;
APIutils.pollRecentNews(POLLING_INTERVAL_MS);


module.exports = app;
process.title = 'nepeta'
process.env.PORT = config.PORT;
