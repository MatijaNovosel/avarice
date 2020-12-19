DROP DATABASE IF EXISTS finapp;
CREATE DATABASE finapp;
USE finapp;

CREATE TABLE AppUser (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255),
  email VARCHAR(255),
  photoURL VARCHAR(255),
  displayName VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE AppSetting (
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
  FOREIGN KEY (appUserId) REFERENCES AppUser(id)
);

CREATE TABLE PaymentSource (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255)
);

CREATE TABLE FinancialChange (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DOUBLE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  description VARCHAR(255),
  expense BOOLEAN,
  paymentSourceId INT,
  appUserId INT,
  FOREIGN KEY (appUserId) REFERENCES AppUser(id),
  FOREIGN KEY (paymentSourceId) REFERENCES PaymentSource(id)
);

CREATE TABLE Tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255)
);

CREATE TABLE FinancialChangeTag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  financialChangeId INT NOT NULL,
  tagId INT NOT NULL,
  FOREIGN KEY (financialChangeId) REFERENCES FinancialChange(id),
  FOREIGN KEY (tagId) REFERENCES Tag(id)
);

CREATE TABLE FinancialHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  checking DOUBLE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  euros DOUBLE,
  gyro DOUBLE,
  pocket DOUBLE,
  appUserId INT NOT NULL,
  FOREIGN KEY (appUserId) REFERENCES AppUser(id)
);

DELIMITER $$ 
DROP TRIGGER IF EXISTS appUserAfterInsertTrigger $$ 
CREATE TRIGGER appUserAfterInsertTrigger AFTER INSERT ON finapp.appuser FOR EACH ROW 
  BEGIN
    INSERT INTO finapp.financialhistory (appUserId, checking, createdAt, euros, gyro, pocket) 
    VALUES (NEW.id, 0, CURRENT_TIMESTAMP(), 0, 0, 0);
    INSERT INTO finapp.appsetting (appUserId, checkingGraphColor, checkingGraphVisible, gyroGraphColor, gyroGraphVisible, pocketGraphColor, pocketGraphVisible, totalGraphColor, totalGraphVisible)
    VALUES (NEW.id, "#ffffff", 1, "#ffffff", 1, "#ffffff", 1, "#ffffff", 1);
END $$ 
DELIMITER;

INSERT INTO finapp.appuser (displayName, email, photoURL, uid) VALUES ("Matija Novosel", "mnovosel5@gmail.com", "url.url", "uid");
INSERT INTO finapp.tag (description) VALUES ("Hrana"), ("Darovi"), ("Igre"), ("Javni prijevoz"), ("Ostalo"), ("Piće"), ("Namirnice");
INSERT INTO finapp.paymentsource (description) VALUES ("Žiro račun"), ("Tekući račun"), ("Džep");