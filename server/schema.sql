CREATE DATABASE IF NOT EXISTS connectFour;
USE connectFour;

CREATE TABLE IF NOT EXISTS scoreboard (
  `id` INT NOT NULL AUTO_INCREMENT,
  `score` INT NOT NULL,
  PRIMARY KEY (ID)
);

-- mysql -u root < server/schema.sql