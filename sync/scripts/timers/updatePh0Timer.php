<?php
session_start();
require_once '../baseFuncs.php';
$c = dbconnect_tlbot();
$gid = $_POST['gameID'];
if(!$gid) {
  die("Error in updateTimer event.");
}
$q = "SELECT ph0timer FROM gametimers WHERE game_id = " . $gid;
if(!$r = mysqli_fetch_assoc(mysqli_query($c, $q))) {
  die("Error in updateTimer event: could not retrieve timer count.");
}
echo $r['ph0timer'];

?>
