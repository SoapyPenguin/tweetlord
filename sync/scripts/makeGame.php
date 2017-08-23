<?php
/*
—Phase 0: Joining —
-From lobby, one player makes game
-Navigated to game.php?gc=<gamecode>: joining phase
-60 seconds for players to join
-Can be postponed up to 6 times, adding 20 seconds each time -> if host=1 then can increment joinPostpones while < 6
-Players leaving/joining at this time will add/remove players/points json values on action
-If host, can hit “Start Now” if there are >3 players
-After timer runs out, game starts
— Phase 1: Tweet comp —
-View changes when clients detect game.phase=1
-Every player assigned a random target tweeter (no duplicates) and prompted to compose tweet (60 seconds)
-Tweets stored
-When tweet entered, set flag=1 for corresponding player
-When all flags=1 or timers reach 0, game.phase=2
— Phase 2: Commenting/rating —
-Player not in hasTweeted chosen at random to be currentTweeter
-Composed tweet displayed on template to all players
-30 seconds for commenters (non currentTweeter) to rate tweet (rating system tbd) and enter comments
-Comments displayed/appended as they come in (preferable)
-Comments not finished within 30 seconds discarded or replaced with random comments
-Input/controls hidden after 30 secs
— Phase 3: Rating comments —
-15 seconds to display tweet and have currentTweeter give points to the comments (ranking?)
-currentTweeter added to hasTweeted
— Phase 4: Scoring summary —
-10 seconds to display current rankings, preferably horizontal bar w/ animations
-No input received, all client-sided timers
-Afterwards, increments round counter if <6 and goes back to Phase 2
-If currently round 6, game is over! Phase goes to 5
— Phase 5: Game over —
-Scores displayed, possible bonuses awarded, set endTime
-Button to return to lobby.php or host can choose to play again
-If play again chosen, makeGame.php and redirect all currently connected players to new game.php?gc=xxxxxx
Random idea: fps that forces you to move via a bar that depletes when standing still
*/
session_start();
require_once 'baseFuncs.php';

if($_POST['makeGameGate'] == "verified") {

  $uname = test_input($_POST['namepromptM']);
  $umdate = date("Y-m-d H:i:s");
  $gcode = generateGC();

  //Make user
  $makeuser = "INSERT INTO users (username, game, make_date, active) VALUES ('" . $uname . "', '" . $gcode . "', '" . $umdate . "', 0)";
  $conn = dbconnect_tlbot();

  if(!$madeuser = mysqli_query($conn, $makeuser)) {
    die("Critical error: failed to create user record.");
  }
  usleep(100000);

  $getuid = "SELECT * FROM users WHERE username = '" . $uname . "' AND game = '" . $gcode . "' AND make_date = '" . $umdate . "'";
  if(!$gotuid = mysqli_query($conn, $getuid)) {
    die("Critical error: failed to fetch user ID.");
  }
  $fetchuidarr = mysqli_fetch_array($gotuid, MYSQLI_NUM);
  $uid = $fetchuidarr[0];

  //Make game
  $gplayers = '{"p1":"' . $uid . '","p2":"none","p3":"none","p4":"none","p5":"none","p6":"none"}';
  $gpoints = '{"p1":0,"p2":0,"p3":0,"p4":0,"p5":0,"p6":0}';
  $gstime = date("Y-m-d H:i:s");
  $makegame = "INSERT INTO game (code, players, points, host, round, phase, starttime, postpones) " .
  "VALUES ('" . $gcode . "', '" . $gplayers . "', '" . $gpoints . "', '" . $uid . "', 0, 0, '" . $gstime . "', 0)";
  if(!$madegame = mysqli_query($conn, $makegame)) {
    die("Critical error: failed to make game.");
  }
  usleep(100000);

  $getgid = "SELECT * FROM game WHERE code = '" . $gcode . "' AND host = '" . $uid . "'";
  if(!$gotgid = mysqli_query($conn, $getgid)) {
    die("Critical error: failed to make game.");
  }
  $gidarr = mysqli_fetch_array($gotgid, MYSQLI_NUM);
  $gid = $gidarr[0];

  //Make gametweets
  $gtweeters = '{"p1":"none","p2":"none","p3":"none","p4":"none","p5":"none","p6":"none"}';
  $gtweeted = '["nobody","nobody","nobody","nobody","nobody","nobody"]';
  $makegt = "INSERT INTO gametweets (game_id, tweeters, tweeted) VALUES ('" . $gid . "', '" . $gtweeters . "', '" . $gtweeted . "')";
  if(!$madegt = mysqli_query($conn, $makegt)) {
    die("Critical error: failed to make gametweets.");
  }
  mysqli_close($conn);

  //Set session variables
  $_SESSION['userID'] = $uid;
  $_SESSION['username'] = $uname;
  $_SESSION['userMakeDate'] = $umdate;
  $_SESSION['gameID'] = $gid;
  $_SESSION['gameCode'] = $gcode;
  $_SESSION['gameMakeDate'] = $gstime;

  header("Location: http://localhost:8080/sync/game.php?gc=" . $gcode);
  die("Game created!");
}




?>
