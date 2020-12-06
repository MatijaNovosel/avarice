DROP DATABASE IF EXISTS finapp;

CREATE DATABASE finapp;
USE finapp;

CREATE TABLE AppUser (
	id INT AUTO_INCREMENT PRIMARY KEY,
	uid VARCHAR(255),
	email VARCHAR(255),
	photoURL VARCHAR(255),
	displayName VARCHAR(255)
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
	totalGraphVisible BOOLEAN
);

CREATE TABLE AppUserSetting (
	appUserId INT NOT NULL,
	appSettingId INT NOT NULL,
	FOREIGN KEY (appUserId) REFERENCES AppUser(id),
	FOREIGN KEY (appSettingId) REFERENCES AppSetting(id)
);

CREATE TABLE PaymentSource (
	id INT AUTO_INCREMENT PRIMARY KEY,
	description VARCHAR(255)
);

CREATE TABLE FinancialChange (
	id INT AUTO_INCREMENT PRIMARY KEY,
	amount DOUBLE,
	createdAt DATE,
	description VARCHAR(255),
	expense BOOLEAN,
	paymentSourceId INT,
	FOREIGN KEY (paymentSourceId) REFERENCES PaymentSource(id)
);

CREATE TABLE Tag (
	id INT AUTO_INCREMENT PRIMARY KEY,
	description VARCHAR(255)
);

CREATE TABLE FinancialChangeTag (
	financialChangeId INT NOT NULL,
	tagId INT NOT NULL,
	FOREIGN KEY (financialChangeId) REFERENCES FinancialChange(id),
	FOREIGN KEY (tagId) REFERENCES Tag(id)
);

CREATE TABLE FinancialHistory (
	id INT AUTO_INCREMENT PRIMARY KEY,
	checking DOUBLE,
	createdAt DATE,
	euros DOUBLE,
	gyro DOUBLE,
	pocket DOUBLE,
	appUserId INT NOT NULL,
	FOREIGN KEY (appUserId) REFERENCES AppUser(id)
);