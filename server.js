var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// counter counts the message id.
counter = 0;

// map holds the socket id and its text color.
map = {};

server.listen(process.env.PORT || 3000);
console.log('Server is running on port 3000...');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    // Assign a random color to a socket.
    map[socket.id] = getRandomColor();
    console.log(map)

    // Remove the socket when user disconnects.
    socket.on('disconnect', function(data) {
        delete map[socket.id];
    });

    // Send message.
    socket.on('send message', function(data) {
        counter += 1;
	io.sockets.emit('new message', {msgID: counter, msg: data, color: map[socket.id]});
    });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
