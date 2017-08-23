<?php
session_start();
require_once 'baseFuncs.php';

$pid = $_POST['pid'];
$gid = $_POST['gid'];
$users = json_decode($_POST['players'], true);
$slot = 0;

//Set php variables
$uindex = 1;
foreach($users as $u) {
  if($u == $pid) {
    $slot = $uindex;
  }
  $uindex++;
}
if($slot == 0) {
  die("Error in playerLeave event: could not resolve player slot.");
}
$users["p" . $slot] = "none";
$newusers = json_encode($users);
//Update db
$dbcon = dbconnect_tlbot();
$leavesql = "UPDATE game SET players = '" . $newusers . "' WHERE game_id = " . $gid;
if(!$pleft = mysqli_query($dbcon, $leavesql)) {
  die("Error in playerLeave event: could not update db.");
}
session_destroy();
die();
?>
