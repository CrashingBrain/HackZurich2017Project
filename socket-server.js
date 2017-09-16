/** @module socket-server.js
* Socket server for events
*/
'use strict';

/* Import */
const socketIo = require('socket.io');
const util = require('util');

/* Export */
module.exports = function(httpServer) {
	var io = socketIo(httpServer);

	/* Socket.io server */
	io.on('connect', function(socket) {
		console.log('New client connected: ' + socket.id);

		socket.on('disconnect', function(reason) {
			console.log('Client disconnected: ' + JSON.stringify(reason));
		});

		socket.on('error', function(err) {
			console.log("Error: " + err);
		});

	});
}
