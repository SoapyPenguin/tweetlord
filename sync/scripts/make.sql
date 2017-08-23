CREATE DATABASE IF NOT EXISTS tweetlord;

CREATE TABLE IF NOT EXISTS users (
user_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(16) NOT NULL,
game VARCHAR(6) NULL,
make_date DATETIME NULL
);
