<!DOCTYPE HTML>
<?php
/*__________________________________________________________________________________________
/* == SETUP =============================================================================== */
session_start();
require_once 'scripts/baseFuncs.php';
$conn = dbconnect_tlbot();
/*__________________________________________________________________________________________________________
/* == GET INITIAL GAME INFO =============================================================================== */
$getgid = "SELECT * FROM game WHERE code = '" . $_GET['gc'] . "' ORDER BY starttime desc";
if(!$thisgame = mysqli_fetch_assoc(mysqli_query($conn, $getgid))) {
	echo "Error: unable to get game information.";
}
$_SESSION['gameID'] = $thisgame['game_id'];
$_SESSION['gameCode'] = $thisgame['code'];
$_SESSION['gameHost'] = $thisgame['host'];
$_SESSION['gamePhase'] = 999;
$_SESSION['gamePlayers'] = $thisgame['players'];
$gameplayers = json_decode($thisgame['players'], true);
$gamepts = $thisgame['points'];
$gameuids = [];
foreach($gameplayers as $u) {
	if($u == "none") {
		array_push($gameuids, '0');
	} else {
		array_push($gameuids, $u);
	}
}
/*__________________________________________________________________________________________________
/* == GET USER INFO =============================================================================== */
$gamenames = array();
for($i = 0; $i < 6; $i++) {
	$gamenames[$i] = "";
}
$getnames = "SELECT * FROM users WHERE user_id IN ('" . $gameuids[0] . "','" . $gameuids[1] . "','" . $gameuids[2] . "','" . $gameuids[3] .
"','" . $gameuids[4] . "', '" . $gameuids[5] . "') ORDER BY FIELD(user_id, '" . $gameuids[0] . "','" . $gameuids[1] . "','" . $gameuids[2] . "','" . $gameuids[3] .
"','" . $gameuids[4] . "', '" . $gameuids[5] . "')";
if(!$gotnames = mysqli_fetch_all(mysqli_query($conn, $getnames), MYSQLI_ASSOC)) {
	echo "Error: unable to fetch usernames.";
}
$gnindex = 0;
foreach($gotnames as $nrow) {
	$gamenames[$gnindex] = $nrow['username'];
	$gnindex++;
}

mysqli_close($conn);
?>
<html lang="en">
<head>
	<title>Tweetlord</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="stylesheet" href="neon.css" title="Main Look">
	<link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Fascinate+Inline" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Erica+One" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
	<!-- Latest compiled and minified JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
</head>
<style type="text/css">
	* {
		<?php if(isSet($_SESSION['fontPref']) && $_SESSION['fontPref'] == 0) { ?>
			font-family: sans-serif;
		<?php } ?>
		font-family: "Source Sans Pro", sans-serif;
	}
</style>
<body>
	<div class="top-banner">
		<div class="banner-jt">
			<h1 class="banner-title" align="center" style="font-family:'Fascinate Inline'"><span class="btitle1">Tweet</span><span class="btitle2">lord</span></h1>
		</div>
	</div>
	<div class="container-fluid" id="game-container">
		<header>
			<nav class="navbar navbar-inverse navbar-static-top">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="http://localhost:8080/sync/lobby.php">Home</a>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						<li class="active"><a href="#">Home</a></li>
						<li><a href="" data-toggle="modal" data-target="#about-modal">About</a></li>
						<li><a href="#">Quit</a></li>
					</ul>
				</div>
			</nav>
		</header>
		<div id="about-modal" class="modal fade" role="dialog">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">About Tweetlord</h4>
					</div>
					<div class="modal-body">
						<p>Welcome to the next generation of shitposting. You and up to 6 friends take
						turns being the 'Tweeter', or the one impersonating various renowned Twitter afficionados as
						accurately or insensitively as their heart desires, while the others play the part of the
						ravenously unforgiving comment section. Earn points by composing the funniest and
						best tweets and comments to win!</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
  		<div class="game-content">
				<div class="ph0-content">
					<h3 class="ph0-header">Waiting for players to join...</h3>
					<div class="ph0-gc">GAME CODE: <br><span class="ph0-codespan"><?php echo $_REQUEST['gc']; ?></span></div>
					<div class="ph0-timer"></div>
					<ul class="ph0-playerlist">
						<li class="ph0-p1"><span class="ph-listitem"><?php echo $gamenames[0]; ?></span></li>
						<li class="ph0-p2"><span class="ph-listitem"><?php echo $gamenames[1]; ?></span></li>
						<li class="ph0-p3"><span class="ph-listitem"><?php echo $gamenames[2]; ?></span></li>
						<li class="ph0-p4"><span class="ph-listitem"><?php echo $gamenames[3]; ?></span></li>
						<li class="ph0-p5"><span class="ph-listitem"><?php echo $gamenames[4]; ?></span></li>
						<li class="ph0-p6"><span class="ph-listitem"><?php echo $gamenames[5]; ?></span></li>
					</ul>
				</div>
      </div>
			<div class="ph1-content">
			</div>
    </div>
	</body>
</html>
<script type="text/javascript">
$(document).ready(function() {

	//Gamevars
	var gameID = <?php echo $_SESSION['gameID']; ?>;
	var gameCode = '<?php echo $_SESSION['gameCode']; ?>';
	var gamePlayers = {};
	<?php if($gameplayers['p1'] != "none") { ?>
		gamePlayers["p1"] = <?php echo $gameplayers['p1']; ?>;
	<?php } if($gameplayers['p2'] != "none") { ?>
		gamePlayers["p2"] = <?php echo $gameplayers['p2']; ?>;
	<?php } if($gameplayers['p3'] != "none") { ?>
		gamePlayers["p3"] = <?php echo $gameplayers['p3']; ?>;
	<?php } if($gameplayers['p4'] != "none") { ?>
		gamePlayers["p4"] = <?php echo $gameplayers['p4']; ?>;
	<?php } if($gameplayers['p5'] != "none") { ?>
		gamePlayers["p5"] = <?php echo $gameplayers['p5']; ?>;
	<?php } if($gameplayers['p6'] != "none") { ?>
		gamePlayers["p6"] = <?php echo $gameplayers['p6']; ?>;
	<?php } ?>
		console.log(JSON.stringify(gamePlayers));
	var gamePoints = JSON.parse('<?php echo $gamepts; ?>');
	var userID = <?php echo $_SESSION['userID']; ?>;
	var phase = 999;
	var round = 999;

	//Player leave
	window.onbeforeunload = function() {
		$.ajax({
			url: "/sync/scripts/playerLeave.php",
			type: "POST",
			data: {
				pid: <?php echo $_SESSION['userID']; ?>,
				gid: gameID,
				players: <?php echo json_encode($_SESSION['gamePlayers']); ?>
			},
			async: false,
			success: function(response) {
				console.log("Player disconnected. " + response);
			},
			error: function(error) {
				console.log("Error on playerLeave event. " + error);
			}
		});
		return;
	}

	window.addEventListener("beforeunload", function() {
		$.ajax({
			url: "/sync/scripts/playerLeave.php",
			type: "POST",
			data: {
				pid: <?php echo $_SESSION['userID']; ?>,
				gid: gameID,
				players: <?php echo json_encode($_SESSION['gamePlayers']); ?>
			},
			async: false,
			success: function(response) {
				console.log("Player disconnected. " + response);
			},
			error: function(error) {
				console.log("Error on playerLeave event. " + error);
			}
		});
	});

	//Get game info
	setInterval(function() {
		$.ajax({
			url: "/sync/scripts/updateGame.php",
			type: "POST",
			data: {
				gameID: gameID
			},
			success: function(response) {
				console.log("EXECUTED updateGame.php");
				gstate = JSON.parse(response);
				phase = gstate.phase;
				round = gstate.round;
				gamePlayers = gstate.players;
				gamePoints = gstate.points;
			},
			error: function() {
				alert("Sorry, but an error occurred when updating game. Try refreshing the page.");
			}
		});
	}, 3000);

	//Game logic
	if(phase == 0) {
		setInterval(function() {

		}, 1000);
	}

	function updatePhase0() {
		$.ajax({
			url: "/sync/scripts/phase0.php",
			type: "POST",
			data: {
				gameID: gameID
			},
			success: function(response) {


			},
			error: function() {
				alert("Sorry, but an error occurred when updating game. Try refreshing the page.");
			}
		});
	}

	//Game over
	function gameOver() {
		$.ajax({
			url: "/sync/scripts/gameOver.php",
			type: "POST",
			data: {
				gameID: gameID
			},
			success: function(response) {
				console.log("Game over.");
			},
			error: function() {
				alert("Whoops, an error occurred in ending the game.");
			}
		});
	}


});
</script>
