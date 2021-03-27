DROP DATABASE IF EXISTS finapp;
CREATE DATABASE finapp;
USE finapp;

CREATE TABLE `tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `appuser` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uid` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `photoURL` VARCHAR(255) DEFAULT NULL,
  `displayName` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `emailConfirmed` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `paymentsource` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `currency` VARCHAR(50) NOT NULL DEFAULT 'HRK',
  `icon` VARCHAR(50) NOT NULL DEFAULT 'eye',
  `description` VARCHAR(255) DEFAULT NULL,
  `appUserId` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appUserId` (`appUserId`),
  CONSTRAINT `paymentsource_ibfk_1` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `locale` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `appsetting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `darkMode` TINYINT(1) DEFAULT NULL,
  `localeId` INT DEFAULT NULL,
  `preferredCurrency` VARCHAR(50) NOT NULL DEFAULT 'HRK',
  `dateFormat` VARCHAR(50) NOT NULL DEFAULT 'dd.MM.yyyy. HH:mm',
  `appUserId` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appUserId` (`appUserId`),
  CONSTRAINT `appsetting_ibfk_1` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`),
  CONSTRAINT `appsetting_ibfk_2` FOREIGN KEY (`localeId`) REFERENCES `locale` (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `financialchange` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `amount` DOUBLE DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` VARCHAR(255) DEFAULT NULL,
  `expense` TINYINT(1) DEFAULT NULL,
  `paymentSourceId` INT DEFAULT NULL,
  `appUserId` INT DEFAULT NULL,
  `transfer` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `appUserId` (`appUserId`),
  KEY `paymentSourceId` (`paymentSourceId`),
  CONSTRAINT `financialchange_ibfk_1` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`),
  CONSTRAINT `financialchange_ibfk_2` FOREIGN KEY (`paymentSourceId`) REFERENCES `paymentsource` (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `financialchangetag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `financialChangeId` INT DEFAULT NULL,
  `tagId` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financialChangeId` (`financialChangeId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `financialchangetag_ibfk_1` FOREIGN KEY (`financialChangeId`) REFERENCES `financialchange` (`id`),
  CONSTRAINT `financialchangetag_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `financialhistory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `paymentSourceId` INT DEFAULT NULL,
  `amount` DOUBLE NOT NULL DEFAULT '0',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `appUserId` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `paymentSourceId` (`paymentSourceId`),
  KEY `appUserId` (`appUserId`),
  CONSTRAINT `financialhistory_ibfk_1` FOREIGN KEY (`paymentSourceId`) REFERENCES `paymentsource` (`id`),
  CONSTRAINT `financialhistory_ibfk_2` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DELIMITER $$ 
DROP TRIGGER IF EXISTS appUserAfterInsertTrigger $$ 
CREATE TRIGGER appUserAfterInsertTrigger AFTER INSERT ON appuser FOR EACH ROW 
BEGIN
  INSERT INTO appsetting (appUserId, darkMode)
  VALUES (NEW.id, 0);
END $$ 
DELIMITER;

DELIMITER $$ 
DROP TRIGGER IF EXISTS financialChangeAfterInsertTrigger $$ 
CREATE TRIGGER financialChangeAfterInsertTrigger AFTER INSERT ON financialChange FOR EACH ROW 
BEGIN
  DELETE FROM financialChangeTag WHERE tagId IS NULL OR financialChangeId IS NULL; 
END $$ 
DELIMITER;

DELIMITER $$
DROP FUNCTION IF EXISTS getPercentageOfTag $$
CREATE FUNCTION getPercentageOfTag(id INT, userId INT) RETURNS DECIMAL(5, 5)
DETERMINISTIC
BEGIN
	DECLARE totalRecords INT DEFAULT 0;
	DECLARE requestedRecords INT DEFAULT 0;
	
	SET totalRecords = (
		SELECT COUNT(DISTINCT(financialChangeId)) 
		FROM financialchangetag fct 
		JOIN financialchange fc ON fc.id = fct.financialChangeId 
		WHERE expense = 1
	);
	
	SET requestedRecords = (
		SELECT COUNT(*) 
		FROM financialchangetag fct 
		JOIN financialchange fc ON fc.id = fct.financialChangeId 
		WHERE expense = 1 AND tagId = id
	);
	
	RETURN requestedRecords / totalRecords;
END; $$
DELIMITER ;

DROP PROCEDURE IF EXISTS getTagPercentages;
DELIMITER $$
CREATE PROCEDURE getTagPercentages(userId INT)
BEGIN
	DECLARE tId INT DEFAULT 0;
	DECLARE tDescription VARCHAR(255) DEFAULT "";
	DECLARE finished BOOL DEFAULT FALSE;
	DECLARE transferTagId INT DEFAULT 0;
	
	DECLARE curTags CURSOR FOR SELECT id, `description` FROM tag;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = TRUE;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION SELECT NULL;
	
	DROP TEMPORARY TABLE IF EXISTS tagPercentages;
	CREATE TEMPORARY TABLE tagPercentages (
		id INT, 
		`description` VARCHAR(255), 
		percentage DECIMAL(5, 5)
	);
	
	SET transferTagId = (SELECT id FROM tag WHERE `description` LIKE 'Transfer');
	
	OPEN curTags;
	tagLoop:LOOP
		FETCH curTags INTO tId, tDescription;
		IF finished = TRUE THEN LEAVE tagLoop; END IF;
		IF getPercentageOfTag(tId, userId) > 0 && transferTagId != tId THEN
			INSERT INTO tagPercentages (id, `description`, percentage) 
			VALUES (tId, tDescription, getPercentageOfTag(tId, userId));
		END IF;
	END LOOP;
	CLOSE curTags;
	
	SELECT * FROM tagPercentages;
END; $$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS getDailyAmount $$
CREATE FUNCTION getDailyAmount(argCreatedAt DATE, argExpense BIT) RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
	DECLARE res DECIMAL(10,2) DEFAULT 0;
	
	SET res = (
		SELECT ROUND(SUM(amount), 2)
		FROM financialchange
		WHERE DATE(createdAt) LIKE argCreatedAt AND
		expense = argExpense AND
		transfer = 0
	);
	
	IF res IS NULL THEN
		RETURN 0;
	ELSE
		RETURN res;
	END IF;
END; $$
DELIMITER ;

DROP PROCEDURE IF EXISTS getDailyChanges;
DELIMITER $$
CREATE PROCEDURE getDailyChanges(userId INT)
BEGIN
	DECLARE tCreatedAt DATE;
	DECLARE finished BOOL DEFAULT FALSE;

	DECLARE curDates CURSOR FOR 
	SELECT DATE(createdAt)
	FROM financialhistory
	GROUP BY DATE(createdAt)
	ORDER BY createdAt DESC
	LIMIT 30;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = TRUE;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION SELECT NULL;
	
	DROP TEMPORARY TABLE IF EXISTS dailyChanges;
	CREATE TEMPORARY TABLE dailyChanges (
		deposits DECIMAL(10, 2), 
		withdrawals DECIMAL(10, 2), 
		createdAt DATE
	);
	
	OPEN curDates;
	datesLoop:LOOP
		FETCH curDates INTO tCreatedAt;
		
		IF finished = TRUE THEN LEAVE datesLoop; END IF;
		
		INSERT INTO dailyChanges (deposits, withdrawals, createdAt) 
		VALUES (
			(SELECT getDailyAmount(tCreatedAt, 0)), 
			(SELECT getDailyAmount(tCreatedAt, 1)), 
			tCreatedAt
		);
	END LOOP;
	CLOSE curDates;
	
	SELECT * FROM dailyChanges;
END; $$
DELIMITER ;
