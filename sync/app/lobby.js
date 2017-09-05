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
var gameState = {
    inProgress: false,
    code: generateGC(),
    players: {1:"",2:"",3:"",4:"",5:"",6:""},
    points: {1:0,2:0,3:0,4:0,5:0,6:0},
    timers: {0:60,1:60,2:30,3:15,4:10,5:60},
    round: 0,
    phase: 0,
    starttime: new Date(),
    endtime: undefined,
    postpones: 0,
    currentTweeter: 0,
    hasTweeted: []
}
console.log(gameState);

var SOCKETLIST = {};

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
});

/*******************************************************************************************************************************/
//Lobby forms
tweetlord.post('/scripts/makeGame', function(req, res) {
    gameState.players[1] = req.body.namepromptM;
    gameState.inProgress = true;
    res.writeHead(301, { Location: '/play/' + gameState.code });
    res.end();
});

tweetlord.post('/scripts/joinGame', function(req, res) {
    //Full check
    isFull = true;
    for(var j = 0; j < 6; j++) {
        if(gameState.players[j] == "") {
            isFull = false;
        }
    }
    if(isFull == true) {
        alert("Sorry, game is full");
        return;
    }
    //Add name
    for(var i = 0; i < 6; i++) {
        //Be original
        if(gameState.players[i] == req.body.namepromptJ) {
            req.body.namepromptJ = req.body.namepromptJ + " 2";
        }
        if(gameState.players[i] == "") {
            gameState.players[i] = req.body.namepromptJ;
        }
    }
    gameState.code = req.body.gameprompt;
    res.writeHead(301, { Location: '/play/' + gameState.code });
    res.end();
});

/*******************************************************************************************************************************/
//Listen
serv.listen(8081, function() {
  console.log("WELCOME TO TWEETLORRRRD!");
  console.log();
});

/*******************************************************************************************************************************/
//Sockets
var io = require('socket.io')(serv);
io.sockets.on('connection', function(socket) {
    var slen = Object.keys(SOCKETLIST).length;
    socket.tlid = slen + 1;
    socket.name = gName;
    socket.players = gPlayers;
    socket.points = 0;
    SOCKETLIST[socket.tlid] = socket;
    console.log("Socket connection initialized: socket " + socket.tlid);

    socket.on('sockettest', function(data) {
      console.log(data.welcome);
    });

    socket.on('disconnect', function() {
      delete SOCKETLIST[socket.tlid];
      console.log("Socket " + socket.tlid + " disconnected");
    });

});

/*******************************************************************************************************************************/
//Game loop
setInterval(function() {
    if(gameState.inProgress == true) {
        //Send game info
        emitToAll('updateGame');
        //Phase change events
        switch(gameState.phase) {
            case 0:
                phaseZeroTick();
                emitToAll('phaseZeroTick');
                break;
            case 1:
                phaseOneTick();
                emitToAll('phaseOneTick');
                break;
            case 2:
                phaseTwoTick();
                emitToAll('phaseTwoTick');
                break;
            case 3:
                phaseThreeTick();
                emitToAll('phaseThreeTick');
                break;
            case 4:
                phaseFourTick();
                emitToAll('phaseFourTick');
                break;
            case 5:
                phaseFiveTick();
                emitToAll('phaseFiveTick');
                break;
        }
    }
}, 1000);

function emitToAll(event) {
    for(var s in SOCKETLIST) {
        var socket = SOCKETLIST[s];
        socket.emit(event, {
            gameState: gameState
        });
    }
}

function phaseZeroTick() {
    gameState.timers[0] = gameState.timers[0] - 1;
    if(gameState.timers[0] == 0) {
        gameState.phase = 1;
        emitToAll('startPhaseOne');
    }
}


/*******************************************************************************************************************************/
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

//DB - deprecated
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