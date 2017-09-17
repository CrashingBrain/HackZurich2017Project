/** @module socket-server.js
* Socket server for events
*/
'use strict';

/* Import */
const socketIo = require('socket.io');
const util = require('util');
var debug = require('debug')('websocket');

/* Export */
module.exports = function(httpServer) {
	var io = socketIo(httpServer);

	/* Socket.io server */
	io.on('connect', function(socket) {
    debug('New client connected: ' + socket.id);

		socket.on('disconnect', function(reason) {
			debug('Client disconnected: ' + JSON.stringify(reason));
		});

		socket.on('error', function(err) {
			debug("Error: " + err);
		});

	});
}
