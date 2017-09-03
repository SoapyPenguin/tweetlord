var express = require('express');
var tweetlord = express();
var serv = require('http').Server(tweetlord);
var path = require('path');
var db = require('mysql');
var bodyParser = require('body-parser');
tweetlord.use(bodyParser.urlencoded({ extended: false }));
tweetlord.use(bodyParser.json());

//Desktop: 0, Laptop: 1
var pathmode = 1;

tweetlord.use(express.static(__dirname + '/../public'));
console.log("Loading...");

//DB
dbcon = db.createConnection({
    host: "localhost",
    user: "root",
    password: "TiredOctopus40",
    database: "tweetlord"
});
dbcon.connect(function(err) {
    if(err) {
        console.log("Error in making db connection");
    }
    console.log("Connected to tweetlord db");
});

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
    var mdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var makePlayer = "INSERT INTO users (username, game, make_date) VALUES ('" + name + "', '" + generateGC() + "', '" + mdate + "')";
    dbcon.query(makePlayer, function(err, result) {
        if(err) {
            console.log("Error while making player db entry");
        }
        console.log("Player " + name + " created");
    });
});

var SOCKETLIST = {};
var io = require('socket.io')(serv);
io.sockets.on('connection', function(socket) {
  console.log("Socket connection initialized.");
  socket.id = Math.floor(Math.random() * 100);
  for(var s in SOCKETLIST) {
      if(!SOCKETLIST.hasOwnProperty(s)) {
          continue;
      }
      //In progress
  }
    
  socket.on('sockettest', function(data) {
      console.log(data.welcome);
  });
    
  socket.on('disconnect', function() {
      //To do
  });
    
});

serv.listen(8081, function() {
  console.log("WELCOME TO TWEETLORRRRD!");
  console.log();
});

//Utility functions
function generateGC() {
    var gcchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var gc = "";
    for(var i = 0; i < 6; i++) {
        var rc = gcchars.charAt(Math.floor(Math.random() * 37));
        gc = gc + rc;
    }
    return gc;
}
