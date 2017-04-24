var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path =  require("path");

server.listen(3000);

io.on('connection', function (socket) {
    socket.broadcast.emit('client-connected');
    socket.on('speak', function (data) {
        io.emit('trig', data);
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
