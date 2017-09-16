/** @module socket-server.js
* Socket server for events
*/
'use strict';

/* Import */
var socketIo = require('socket.io');

/* Export */
module.exports = function(httpServer) {
	var io = socketIo(httpServer);

	/* Socket.io server */
	io.on('connect', function(socket) {
		console.log('Connected');

		socket.on('disconnect', function() {
			console.log('Disconnected');
		});

		socket.on('error', function(err) {
			console.log("Error: " + err);
		});

	});
}
