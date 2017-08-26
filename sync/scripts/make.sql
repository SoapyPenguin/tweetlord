CREATE DATABASE IF NOT EXISTS tweetlord;

CREATE TABLE IF NOT EXISTS users (
user_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(16) NOT NULL,
game VARCHAR(6) NULL,
make_date DATETIME NULL
);

/*
game
  game_id
  code
  players
  points
  host
  round
  phase
  starttime
  endtime
  postpones
  currenttweeter
gametweets
  game_id
  tweeters
  tweeted
  p1tweet
  p2tweet
  ...
  p1comments
  p2comments
  ...
  topics
gameflags
  game_id
  p1flag
  p2flag
  ...
gametimers
  game_id
  ph0timer
  ph1timer
  ph2timer
  ph3timer
  ph4timer

*/
