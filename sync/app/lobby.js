var express = require('express');
var tweetlord = express();
var serv = require('http').Server(tweetlord);
var path = require('path');
var bodyParser = require('body-parser');
tweetlord.use(bodyParser.urlencoded({ extended: false }));
tweetlord.use(bodyParser.json());

//Desktop: 0, Laptop: 1
var pathmode = 1;

tweetlord.use(express.static(__dirname + '/../public'));
console.log("Loading...");

//Root page
tweetlord.get('/', function(req, res) {
  if(pathmode == 0) {
    res.sendFile(path.resolve('/Programs/Nodejs/sync/public/tweetlord.html'));
  } else if(pathmode == 1) {
    res.sendFile(path.resolve('/home/jd/Apps/Nodejs/tweetlord-master/sync/public/tweetlord.html'));
  }
});

//Game page
tweetlord.get('/play/:gameCode', function(req, res) {
  if(req.url == "/play/neon.css") {
    res.set("Content-Type", "text/css");
    if(pathmode == 0) {
      res.sendFile(path.resolve('/Programs/Nodejs/sync/public/neon.css'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/jd/Apps/Nodejs/tweetlord-master/sync/public/neon.css'));
    }
  } else {
    res.set("Content-Type", "text/html");
    if(pathmode == 0) {
      res.sendFile(path.resolve('/Programs/Nodejs/sync/public/play.html'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/jd/Apps/Nodejs/tweetlord-master/sync/public/play.html'));
    }
  }
  var gc = req.params.gameCode;
});

//Lobby forms
tweetlord.post('/scripts/makeGame', function(req, res) {
    var name = req.body.namepromptM;
    
});

var SOCKETLIST = {};
var io = require('socket.io')(serv);
io.sockets.on('connection', function(socket) {
  console.log("Socket connection initialized.");
    
  socket.on('sockettest', function(data) {
      console.log(data.welcome);
  });
    
});

serv.listen(8081, function() {
  console.log("WELCOME TO TWEETLORRRRD!");
});
