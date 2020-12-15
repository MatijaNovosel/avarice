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
  createdAt DATETIME,
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
  createdAt DATETIME,
  euros DOUBLE,
  gyro DOUBLE,
  pocket DOUBLE,
  appUserId INT NOT NULL,
  FOREIGN KEY (appUserId) REFERENCES AppUser(id)
);

INSERT INTO finapp.appuser (displayName, email, photoURL, uid) VALUES ("Matija Novosel", "mnovosel5@gmail.com", "url.url", "uid");

INSERT INTO finapp.tag (description) VALUES ("Hrana"), ("Ostalo");

INSERT INTO finapp.paymentsource (description) VALUES ("Žiro račun"), ("Tekući račun"), ("Džep");

INSERT INTO finapp.financialchange (amount, createdAt, description, expense, paymentSourceId, appUserId) VALUES (255.55, NOW(), "Testing", 1, 1, 1);

INSERT INTO finapp.financialchangetag (financialChangeId, tagId) VALUES (1, 1), (1, 2);