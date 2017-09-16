/* Socket client */

var socket = io.connect('http://localhost');

socket.on('connect', function(data) {
  console.log(data);
});
