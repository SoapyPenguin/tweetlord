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
    tweeters: {1:0,2:0,3:0,4:0,5:0,6:0},
    prompts: {1:0,2:0,3:0,4:0,5:0,6:0},
    tweets: {1:"",2:"",3:"",4:"",5:"",6:""},
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
    //Progress check
    if(gameState.inProgress == false) {
        alert("No game currently in progress. Try 'New Game'.");
        return;
    }
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
            break;
        }
    }
    res.writeHead(301, { Location: '/play/' + gameState.code });
    res.end();
    emitToAll('playerJoin');
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
    socket.name = gameState.players[socket.tlid];
    SOCKETLIST[socket.tlid] = socket;
    console.log("Socket connection initialized: socket " + socket.tlid);

    socket.on('sockettest', function(data) {
        console.log(data.welcome);
    });
    
    socket.emit('setup', {
        gameState: gameState,
        slot: socket.tlid
    });

    socket.on('disconnect', function() {
        //Remove socket
        delete SOCKETLIST[socket.tlid];
        //Remove player
        gameState.players[socket.tlid] = "";
        if(gameState.players[socket.tlid + 1] != "") {
            for(var i = (socket.tlid + 1); i < 7; i++) {
                gameState.players[i - 1] = gameState.players[i];
                gameState.players[i] = "";
            }
        }
        //Restart app if no players left
        var isEmpty = true;
        for(var i = 1; i < 7; i++) {
            if(gameState.players[i] != "") {
                isEmpty = false;
            }
        }
        if(isEmpty == true) {
            restartApp();
        }
        console.log("Socket " + socket.tlid + " disconnected");
    });
    
    //Buttons
    socket.on('postpone', function() {
        if(gameState.postpones > 4) {
            socket.emit('tooManyPostpones');
            return;
        }
        gameState.postpones = gameState.postpones + 1;
        gameState.timers[0] = gameState.timers[0] + 15;
    });
    
    socket.on('impatience', function() {
        gameState.timers[0] = gameState.timers[0] - 1;
    });
});

/*******************************************************************************************************************************/
//Game loop
rollTweeters();
setInterval(function() {
    if(gameState.inProgress == true) {
        //Send game info
        emitToAll('updateGame');
        //Phase change events
        switch(gameState.phase) {
            case 0:
                phaseZeroTick();
                break;
            case 1:
                phaseOneTick();
                break;
            case 2:
                phaseTwoTick();
                break;
            case 3:
                phaseThreeTick();
                break;
            case 4:
                phaseFourTick();
                break;
            case 5:
                phaseFiveTick();
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
    emitToAll('phaseZeroTick');
    if(gameState.timers[0] == 0) {
        gameState.phase = 1;
        emitToAll('startPhaseOne');
    }
}

function phaseOneTick() {
    gameState.timers[1] = gameState.timers[1] - 1;
    emitToAll('phaseOneTick');
    if(gameState.timers[1] == 0) {
        gameState.phase = 2;
        emitToAll('startPhaseTwo');
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

function restartApp() {
    try {
      tweetlord.webserver.close();
      tweetlord.logger("Webserver was halted", 'success');
    } catch (e) {
      tweetlord.logger("Cant't stop webserver:", 'error');
      tweetlord.logger(e, 'error');
    }
    var sExecute = "node " + tweetlord.config.settings.ROOT_DIR + 'app.js';
    if (tweetlord.killed === undefined) {
      tweetlord.killed = true;
      var exec = require('child_process').exec;
      exec(sExecute, function () {
        console.log('APPLICATION RESTARTED', 'success');
        process.kill();
      });
    }
}

/*******************************************************************************************************************************/
//Tweeters/prompts
function rollTweeters() {
    var tweeters = {
        0: { name: "KATY PERRY", handle: "@katyperry" },
        1: { name: "Justin Bieber", handle: "@justinbieber" },
        2: { name: "Barack Obama", handle: "@BarackObama" },
        3: { name: "Taylor Swift", handle: "@taylorswift13" },
        4: { name: "Rihanna", handle: "@rihanna" },
        5: { name: "Ellen Degeneres", handle: "@TheEllenShow" },
        6: { name: "xoxo, Gaga", handle: "@ladygaga" },
        7: { name: "YouTube", handle: "@YouTube" },
        8: { name: "Justin Timberlake", handle: "@jtimberlake" },
        9: { name: "Twitter", handle: "@Twitter" },
        10: { name: "Britney Spears", handle: "@britneyspears" },
        11: { name: "Kim Kardashian West", handle: "@KimKardashian" },
        12: { name: "CNN Breaking News", handle: "@cnnbrk" },
        13: { name: "Selena Gomez", handle: "@selenagomez" },
        14: { name: "Ariana Grande", handle: "@ArianaGrande" },
        15: { name: "jimmy fallon", handle: "@jimmyfallon" },
        16: { name: "Demi Lovato", handle: "@ddlovato" },
        17: { name: "Shakira", handle: "@shakira" },
        18: { name: "Jennifer Lopez", handle: "@JLo" },
        19: { name: "Instagram", handle: "@instagram" },
        20: { name: "The New York Times", handle: "@nytimes" },
        21: { name: "Oprah Winfrey", handle: "@Oprah" },
        22: { name: "Bill Gates", handle: "@BillGates" },
        23: { name: "LeBron James", handle: "@KingJames" },
        24: { name: "Donald J. Trump", handle: "@realDonaldTrump" },
        25: { name: "Drizzy", handle: "@drake" },
        26: { name: "Miley Ray Cyrus", handle: "@MileyCyrus" },
        27: { name: "SportsCenter", handle: "@SportsCenter" },
        28: { name: "BBC Breaking News", handle: "@BBCBreaking" },
        29: { name: "Bruno Mars", handle: "@BrunoMars" },
        30: { name: "Narenda Modi", handle: "@narendamodi" },
        31: { name: "ESPN", handle: "@espn" },
        32: { name: "One Direction", handle: "@onedirection" },
        33: { name: "Wiz Khalifa", handle: "@wizkhalifa" },
        34: { name: "Lil Wayne WEEZY F", handle: "@LilTunechi" },
        35: { name: "P!nk", handle: "@Pink" },
        36: { name: "Adele", handle: "@Adele" },
        37: { name: "Kaka", handle: "@KAKA" },
        38: { name: "Alicia Keys", handle: "@aliciakeys" },
        39: { name: "daniel tosh", handle: "@danieltosh" },
        40: { name: "Neil Patrick Harris", handle: "@ActuallyNPH" },
        41: { name: "NBA", handle: "@NBA" },
        42: { name: "Emma Watson", handle: "@EmmaWatson" },
        43: { name: "NASA", handle: "@NASA" },
        44: { name: "Pitbull", handle: "@pitbull" },
        45: { name: "Conan O'Brien", handle: "@ConanOBrien" },
        46: { name: "Jeb Bush", handle: "@jebbush" },
        47: { name: "Snoop Dogg", handle: "@SnoopDogg" }
    };
    var prompts = {
        0: "Topic: the Syrian conflict",
        1: "Topic: spicy Mexican food",
        2: "Topic: biggest pet peeve",
        3: "Topic: Donald Trump",
        4: "Topic: hentai",
        5: "Topic: Russian hackers",
        6: "Topic: philosophy",
        7: "Topic: climate change refugees",
        8: "Topic: bad TV shows",
        9: "Scenario: earthquake just struck",
        10: "Topic: Eric Andre",
        11: "Topic: Kim Jong Un",
        12: "Topic: the bees are dying at an alarming rate",
        13: "Scenario: a volcano thought to be dormant erupts over a city of thousands of villagers",
        14: "Topic: Jeb Bush's abysmal campaign",
        15: "Topic: dabbing",
        16: "Topic: technology",
        17: "Scenario: Donald Trump impeached",
        18: "Scenario: Jeb Bush announces to run in the next election",
        19: "Topic: aliens",
        20: "Topic: food",
        21: "Scenario: favorite food taken off the market after controversial discovery of small amounts of horse semen",
        22: "Scenario: life discovered on a new planet",
        23: "Scenario: World War 3 is imminent",
        24: "Topic: terrorism",
        25: "Topic: Israeli-Palestinian conflict",
        26: "Scenario: diagnosed with herpes",
        27: "Topic: memes",
        28: "Topic: Dungeons & Dragons",
        29: "Scenario: you're an alcoholic",
        30: "Topic: Black Lives Matter",
        31: "Scenario: declaring bankruptcy",
        32: "Topic: sex robots",
        33: "Topic: Microsoft mass surveillance",
        33: "Scenario: Mark Zuckerberg runs for president",
        34: "Topic: Flint, Michigan",
        35: "Topic: the cloud",
        36: "Scenario: new epidemic of super herpes plagues the world",
        37: "Scenario: Vladimir Putin proposes to Donald Trump, and of course he says yes",
        38: "Scenario: young Filipino male mistaken for Mexican, chaos ensues",
        39: "Scenario: T-Pain is the elected as the next president of the United States"
    };
    for(var i = 1; i < 7; i++) {
        var rTweeter = tweeters[Math.floor(Math.random() * Object.keys(tweeters).length)];
        var rPrompt = prompts[Math.floor(Math.random() * Object.keys(prompts).length)];
        gameState.tweeters[i] = rTweeter;
        gameState.prompts[i] = rPrompt;
    }
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