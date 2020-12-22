DROP DATABASE IF EXISTS finapp;
CREATE DATABASE finapp;
USE finapp;

CREATE TABLE appuser (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255),
  email VARCHAR(255),
  photoURL VARCHAR(255),
  displayName VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE appsetting (
  id INT AUTO_INCREMENT PRIMARY KEY,
  checkingGraphColor VARCHAR(50),
  gyroGraphColor VARCHAR(50),
  pocketGraphColor VARCHAR(50),
  totalGraphColor VARCHAR(50),
  gyroGraphVisible BOOLEAN,
  checkingGraphVisible BOOLEAN,
  pocketGraphVisible BOOLEAN,
  totalGraphVisible BOOLEAN,
  appUserId INT,
  FOREIGN KEY (appUserId) REFERENCES appuser(id)
);

CREATE TABLE paymentsource (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255)
);

CREATE TABLE financialchange (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DOUBLE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  description VARCHAR(255),
  expense BOOLEAN,
  paymentSourceId INT,
  appUserId INT,
  FOREIGN KEY (appUserId) REFERENCES appuser(id),
  FOREIGN KEY (paymentSourceId) REFERENCES paymentsource(id)
);

CREATE TABLE tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255)
);

CREATE TABLE financialchangetag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  financialChangeId INT,
  tagId INT,
  FOREIGN KEY (financialChangeId) REFERENCES financialchange(id),
  FOREIGN KEY (tagId) REFERENCES tag(id)
);

CREATE TABLE financialhistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  checking DOUBLE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  euros DOUBLE,
  gyro DOUBLE,
  pocket DOUBLE,
  appUserId INT NOT NULL,
  FOREIGN KEY (appUserId) REFERENCES appuser(id)
);

DELIMITER $$ 
DROP TRIGGER IF EXISTS appUserAfterInsertTrigger $$ 
CREATE TRIGGER appUserAfterInsertTrigger AFTER INSERT ON appuser FOR EACH ROW 
BEGIN
  INSERT INTO financialhistory (appUserId, checking, createdAt, euros, gyro, pocket) 
  VALUES (NEW.id, 0, CURRENT_TIMESTAMP(), 0, 0, 0);
  INSERT INTO appsetting (appUserId, checkingGraphColor, checkingGraphVisible, gyroGraphColor, gyroGraphVisible, pocketGraphColor, pocketGraphVisible, totalGraphColor, totalGraphVisible)
  VALUES (NEW.id, "#ffffff", 1, "#ffffff", 1, "#ffffff", 1, "#ffffff", 1);
END $$ 
DELIMITER;

DELIMITER $$ 
DROP TRIGGER IF EXISTS financialChangeAfterInsertTrigger $$ 
CREATE TRIGGER financialChangeAfterInsertTrigger AFTER INSERT ON financialChange FOR EACH ROW 
BEGIN
  DELETE FROM financialChange WHERE tagId = NULL OR financialChangeId = NULL; 
END $$ 
DELIMITER;

INSERT INTO appuser (displayName, email, photoURL, uid) VALUES ("Matija Novosel", "mnovosel5@gmail.com", "url.url", "uid");
INSERT INTO tag (description) VALUES ("Hrana"), ("Darovi"), ("Igre"), ("Javni prijevoz"), ("Ostalo"), ("Piće"), ("Namirnice");
INSERT INTO paymentsource (description) VALUES ("Žiro račun"), ("Tekući račun"), ("Džep");