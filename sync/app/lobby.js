var express = require('express');
var tweetlord = express();
var serv = require('http').Server(tweetlord);
var path = require('path');

tweetlord.use(express.static(__dirname + '/../public'));
console.log("Loading...");

//Root page
tweetlord.get('/', function(req, res) {
  res.sendFile(path.resolve('/Programs/Nodejs/sync/public/tweetlord.html'));
});

//Game page
tweetlord.get('/play/:gameCode', function(req, res) {
  console.log(req.url);
  if(req.url == "/play/neon.css") {
    res.set("Content-Type", "text/css");
    res.sendFile(path.resolve('/Programs/Nodejs/sync/public/neon.css'));
  } else {
    res.set("Content-Type", "text/html");
    console.log("whaaa");
    res.sendFile(path.resolve('/Programs/Nodejs/sync/public/play.html'));
  }
  console.log('end switch');
  var gc = req.params.gameCode;
});

var io = require('socket.io')(serv);
io.sockets.on('connection', function(socket) {
  console.log("Socket connection initialized.");
});

serv.listen(8081, function() {
  console.log("WELCOME TO TWEETLORRRRD!");
});
