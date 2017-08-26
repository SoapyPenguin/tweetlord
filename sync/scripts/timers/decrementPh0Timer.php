<?php
session_start();
require_once '../baseFuncs.php';
$c = dbconnect_tlbot();
$gid = $_POST['gameID'];
if(!$gid) {
  die("Error in host's decrementTimer event.");
}
$t = $_POST['tick'] - 1;
$q = "UPDATE gametimers SET ph0timer = " . $t . " WHERE game_id = " . $gid;
if(!mysqli_query($c, $q)) {
  die("Critical error: could not decrement game timer.");
}
mysqli_close($c);
die();
?>
