<?php
session_start();
require_once 'baseFuncs.php';

if($_POST['joinGameGate'] == "verified") {

  $uname = test_input($_POST['namepromptJ']);
  $umdate = date("Y-m-d H:i:s");
  $gcode = test_input($_POST['gameprompt']);

  $makeuser = "INSERT INTO users (username, game, make_date, active) VALUES ('" . $uname . "', '" . $gcode . "', '" . $umdate . "', 1)";
  $conn = dbconnect_tlbot();

  if(!$madeuser = mysqli_query($conn, $makeuser)) {
    die("Critical error: failed to create user record.");
  }
  usleep(200000);

  $getuid = "SELECT * FROM users WHERE username = '" . $uname . "' AND game = '" . $gcode . "' AND make_date = '" . $umdate . "'";
  if(!$gotuid = mysqli_query($conn, $getuid)) {
    die("Critical error: failed to fetch user ID.");
  }
  $fetchuidarr = mysqli_fetch_array($gotuid, MYSQLI_NUM);
  $uid = $fetchuidarr[0];

  $getgame = "SELECT * FROM game WHERE code = '" . $gcode . "' ORDER BY starttime DESC LIMIT 1";
  if(!$thisgame = mysqli_fetch_assoc(mysqli_query($conn, $getgame))) {
    die("Critical error: failed to fetch game information.");
  }
  $gid = $thisgame['game_id'];
  $thisplayers = json_decode($thisgame['players']);
  $fullcheck = 1;
  $pindex = 1;
  foreach($thisplayers as $p) {
    if($fullcheck == 1) {
      if($p == "none") {
        $fullcheck = 0;
        $pslot = "p" . $pindex;
      }
    }
    $pindex++;
  }
  $thisplayers->$pslot = $uid;
  $newplayers = json_encode($thisplayers);

  $entergame = "UPDATE game SET players = '" . $newplayers . "' WHERE game_id = " . $gid;
  if(!$enteredgame = mysqli_query($conn, $entergame)) {
    die("Critical error: failed to enter game.");
  }

  //Set session variables
  $_SESSION['userID'] = $uid;
  $_SESSION['username'] = $uname;
  $_SESSION['userMakeDate'] = $umdate;
  $_SESSION['gameCode'] = $gcode;

  mysqli_close($conn);
  header("Location: http://localhost:8080/sync/game.php?gc=" . $gcode);
  die("Joined game!");
}





?>
