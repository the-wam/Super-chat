var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var moment = require('moment');
var date = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ss');

//Middlewares

app.use('/assets', express.static('public'));

// Chargement de la page accueuil
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

// Chargement de la page chat.html
app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/views/chat.html');
});

// Chargement de la page watcher.html
app.get('/watcher', function (req, res) {
  res.sendfile(__dirname + '/views/watcher.html');
});

io.sockets.on('connection', function (socket, pseudo, date) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.date = date;
        socket.broadcast.emit('nouveau_client', pseudo, date);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message, date:date});
    });
});

server.listen(8080);