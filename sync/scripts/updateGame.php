<?php
session_start();
require_once 'baseFuncs.php';
$con = dbconnect_tlbot();
$getinfo = "SELECT * FROM game WHERE game_id = " . $_POST['gameID'];
if(!$gotinfo = mysqli_fetch_assoc(mysqli_query($con, $getinfo))) {
  die("Critical error: unable to update game info");
}
//Set session variables
$_SESSION['gamePhase'] = $gotinfo['phase'];
$_SESSION['gameRound'] = $gotinfo['round'];
$_SESSION['gamePlayers'] = json_decode($gotinfo['players'], true);
$_SESSION['gamePoints'] = json_decode($gotinfo['points'], true);

//Return array for updating JS vars
$jsarr = '{"phase":' . $gotinfo['phase'] . ',"round":' . $gotinfo['round'] . ',"players":' . $gotinfo['players'] . ',"points":' . $gotinfo['points'] . '}';
echo $jsarr;
die();
?>
