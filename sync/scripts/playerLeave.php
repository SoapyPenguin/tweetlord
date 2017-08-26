<?php
session_start();
require_once 'baseFuncs.php';
$dbcon = dbconnect_tlbot();

$pid = $_POST['pid'];
$gid = $_POST['gid'];
$users = json_decode($_POST['players'], true);
$slot = 0;
$hostleft = 0;

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
} elseif($slot == 1) {
	$hostleft = 1;
}
$users["p" . $slot] = "none";

if($slot != 6 && $users["p" . ($slot+1)] != "none") {
  while($slot < 6) {
	$users["p" . $slot] = $users["p". ($slot+1)];
	$slot++;
  }
}
if($hostleft == 1) {
  $updatehost = "UPDATE game SET host = " . $users["p1"] . " WHERE game_id = " . $gid;
  if(!$newhost = mysqli_query($dbcon, $updatehost)) {
    die("Error in playerLeave event: failed to update host.");
  }
}

$newusers = json_encode($users);
//Update db
$leavesql = "UPDATE game SET players = '" . $newusers . "' WHERE game_id = " . $gid;
if(!$pleft = mysqli_query($dbcon, $leavesql)) {
  die("Error in playerLeave event: could not update db.");
}
session_destroy();
die();
?>
