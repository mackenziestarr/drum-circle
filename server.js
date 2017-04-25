var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path =  require("path");

server.listen(3000);

var clients = [];
var emoji  = ['100', 'apple', 'angry'];
var sounds = ['snare', 'hat', 'bass'];

io.on('connection', function (socket) {
    // keep track of connection
    var id = socket.conn.id;

    clients[id] = {
        id : id,
        emoji : emoji.pop(),
        sound : sounds.pop()
    };

    socket.broadcast.emit('client-connected', clients[id]);

    socket.on('speak', function () {
        io.emit('trig', clients[id]);
    });

    socket.on('disconnect', function (data) {
        emoji.push(clients[id].emoji);
        sounds.push(clients[id].sound);
        socket.broadcast.emit('client-disconnected', clients[id]);
    });
});

app.use(express.static('public'));

app.get('/', function (req, res) {
    var user_agent = req.headers['user-agent'];
    var route = /iPhone|Android/i.test(user_agent) ? '/speak' : '/listen';
    res.redirect(route);
});

app.get('/speak', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/speak.html'));
});

app.get('/listen', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/listen.html'));
});
