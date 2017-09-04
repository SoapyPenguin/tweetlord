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

//Gamevars
var gName = "Deeedle";
var gCode = generateGC();
var gPoints = 0;

//DB
//dbcon = db.createConnection({
//    host: "localhost",
//    user: "root",
//    password: "TiredOctopus40",
//    database: "tweetlord"
//});
//dbcon.connect(function(err) {
//    if(err) {
//        console.log("Error in making db connection");
//    }
//    console.log("Connected to tweetlord db");
//});

/*******************************************************************************************************************************/
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
  //Sockets
  var SOCKETLIST = {};
  var io = require('socket.io')(serv);
  io.sockets.on('connection', function(socket) {
    var slen = Object.keys(SOCKETLIST).length;
    socket.tlid = slen + 1;
    socket.name = gName;
    socket.points = 0;
    SOCKETLIST[socket.tlid] = socket;
    console.log("Socket connection initialized: socket " + socket.tlid);
    
    socket.on('sockettest', function(data) {
      console.log(data.welcome);
    });
    
    socket.on('disconnect', function() {
      delete SOCKETLIST[socket.tlid];
    });
    
  });
});

/*******************************************************************************************************************************/
//Lobby forms
tweetlord.post('/scripts/makeGame', function(req, res) {
    gName = req.body.namepromptM;
    res.writeHead(301, { Location: '/play/' + gCode });
    res.end();
});

tweetlord.post('/scripts/joinGame', function(req, res) {
    gName = req.body.namepromptJ;
    gCode = req.body.gameprompt;
});

/*******************************************************************************************************************************/
//Listen
serv.listen(8081, function() {
  console.log("WELCOME TO TWEETLORRRRD!");
  console.log();
});

//Utility functions
function generateGC() {
    var gcchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var gc = "";
    for(var i = 0; i < 6; i++) {
        var rc = gcchars.charAt(Math.floor(Math.random() * 36));
        gc = gc + rc;
    }
    return gc;
}

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}
