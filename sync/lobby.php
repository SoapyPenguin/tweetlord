<!DOCTYPE HTML>
<?php session_start();
			require_once 'scripts/baseFuncs.php'; ?>
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
		}
	</style>
  <body>
    <div class="top-banner">
      <div class="banner-jt">
        <h1 class="banner-title" align="center"><span class="btitle1">Tweet</span><span class="btitle2">lord</span></h1>
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
  		<div class="lobby-content">
        <div class="menu-view">
          <ul class="lobby-menu">
            <li class="lm-newgame"><span class="label label-info new-game-btn">New Game</span></li>
            <li class="lm-joingame"><span class="label label-info join-game-btn">Join Game</span></li>
            <li class="lm-options"><span class="label label-info options-btn">Options&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span></li>
          </ul>
        </div>
        <div class="newprompt-view">
					<button class="btn btn-default back-btn">Back</button>
          <h4 class="nameprompt-header" align="center">Choose a name</h4>
          <form action="/sync/scripts/makeGame.php" method="post" name="name-prompt" id="name-prompt" class="form-horizontal">
						<input type="hidden" name="makeGameGate" value="verified">
            <input type="text" name="namepromptM" class="form-control" id="nameprompt-input" maxlength="16" placeholder="16 characters max" autofocus required>
						<div class="make-submit">
							<button type="submit" name="make-game-submit" class="btn btn-primary">Start Game!</button>
						</div>
          </form>
        </div>
				<div class="joinprompt-view">
					<button class="btn btn-default back-btn">Back</button>
					<form action="/sync/scripts/joinGame.php" method="post" name="gamecode-prompt" id="gamecode-prompt" class="form-horizontal">
						<input type="hidden" name="joinGameGate" value="verified">
						<h4 class="nameprompt-header" align="center">Choose a name</h4>
						<input type="text" name="namepromptJ" class="form-control" id="nameprompt-input" maxlength="16" placeholder="16 characters max" autofocus required>
						<h4 class="nameprompt-header" align="center">Enter game code</h4>
						<input type="text" name="gameprompt" class="form-control" id="gameprompt-input" maxlength="6" autofocus required>
						<div class="join-submit">
							<button type="submit" name="join-game-submit" class="btn btn-primary">Join Game!</button>
						</div>
					</form>
				</div>
				<div class="options-view">
					<button class="btn btn-default back-btn">Back</button>
					<h3 align="center">Eh, no options yet m9</h3>
				</div>
      </div>
    </div>
	</body>
</html>
<script type="text/javascript">
$(document).ready(function() {

	var lmChoice = 0;

	//Button listeners
	$('.new-game-btn').on('click', function() {
		lmChoice = 1;
		$('.menu-view').fadeOut(function() {
			$('.newprompt-view').fadeIn();
		});
	});

	$('.join-game-btn').on('click', function() {
		lmChoice = 2;
		$('.menu-view').fadeOut(function() {
			$('.joinprompt-view').fadeIn();
		});
	});

	$('.options-btn').on('click', function() {
		lmChoice = 3;
		$('.menu-view').fadeOut(function() {
			$('.options-view').fadeIn();
		});
	});

	$('.back-btn').on('click', function() {
		lmChoice = 0;
		if($('.newprompt-view').css('display') != 'none') {
			$('.newprompt-view').fadeOut(function() {
				$('.menu-view').fadeIn();
			});
		} else if($('.joinprompt-view').css('display') != 'none') {
			$('.joinprompt-view').fadeOut(function() {
				$('.menu-view').fadeIn();
			});
		} else if($('.options-view').css('display') != 'none') {
			$('.options-view').fadeOut(function() {
				$('.menu-view').fadeIn();
			});
		}
	});

});
</script>
