DROP DATABASE IF EXISTS finapp;
CREATE DATABASE finapp;
USE finapp;

CREATE TABLE `appsetting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `checkingGraphColor` varchar(50) DEFAULT NULL,
  `gyroGraphColor` varchar(50) DEFAULT NULL,
  `pocketGraphColor` varchar(50) DEFAULT NULL,
  `totalGraphColor` varchar(50) DEFAULT NULL,
  `gyroGraphVisible` tinyint(1) DEFAULT NULL,
  `checkingGraphVisible` tinyint(1) DEFAULT NULL,
  `pocketGraphVisible` tinyint(1) DEFAULT NULL,
  `totalGraphVisible` tinyint(1) DEFAULT NULL,
  `appUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appUserId` (`appUserId`),
  CONSTRAINT `appsetting_ibfk_1` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `appuser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `photoURL` varchar(255) DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `financialchange` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(255) DEFAULT NULL,
  `expense` tinyint(1) DEFAULT NULL,
  `paymentSourceId` int DEFAULT NULL,
  `appUserId` int DEFAULT NULL,
  `transfer` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `appUserId` (`appUserId`),
  KEY `paymentSourceId` (`paymentSourceId`),
  CONSTRAINT `financialchange_ibfk_1` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`),
  CONSTRAINT `financialchange_ibfk_2` FOREIGN KEY (`paymentSourceId`) REFERENCES `paymentsource` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `financialchangetag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `financialChangeId` int DEFAULT NULL,
  `tagId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financialChangeId` (`financialChangeId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `financialchangetag_ibfk_1` FOREIGN KEY (`financialChangeId`) REFERENCES `financialchange` (`id`),
  CONSTRAINT `financialchangetag_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `financialhistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paymentSourceId` int DEFAULT NULL,
  `amount` double NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `appUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `paymentSourceId` (`paymentSourceId`),
  KEY `appUserId` (`appUserId`),
  CONSTRAINT `financialhistory_ibfk_1` FOREIGN KEY (`paymentSourceId`) REFERENCES `paymentsource` (`id`),
  CONSTRAINT `financialhistory_ibfk_2` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4725 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `paymentsource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currency` varchar(50) NOT NULL DEFAULT 'HRK',
  `icon` varchar(50) NOT NULL DEFAULT 'eye',
  `description` varchar(255) DEFAULT NULL,
  `appUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appUserId` (`appUserId`),
  CONSTRAINT `paymentsource_ibfk_1` FOREIGN KEY (`appUserId`) REFERENCES `appuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER $$ 
DROP TRIGGER IF EXISTS appUserAfterInsertTrigger $$ 
CREATE TRIGGER appUserAfterInsertTrigger AFTER INSERT ON appuser FOR EACH ROW 
BEGIN
  INSERT INTO appsetting (appUserId, checkingGraphColor, checkingGraphVisible, gyroGraphColor, gyroGraphVisible, pocketGraphColor, pocketGraphVisible, totalGraphColor, totalGraphVisible)
  VALUES (NEW.id, "#ffffff", 1, "#ffffff", 1, "#ffffff", 1, "#ffffff", 1);
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

	DECLARE curTags CURSOR FOR SELECT id, `description` FROM tag;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = TRUE;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION SELECT NULL;
	
	DROP TEMPORARY TABLE IF EXISTS tagPercentages;
	CREATE TEMPORARY TABLE tagPercentages (
		id INT, 
		`description` VARCHAR(255), 
		percentage DECIMAL(5, 5)
	);
	
	OPEN curTags;
	tagLoop:LOOP
		FETCH curTags INTO tId, tDescription;
		IF finished = TRUE THEN LEAVE tagLoop; END IF;
		INSERT INTO tagPercentages (id, `description`, percentage) 
		VALUES (tId, tDescription, getPercentageOfTag(tId, userId));
	END LOOP;
	CLOSE curTags;
	
	SELECT * FROM tagPercentages;
END; $$
DELIMITER ;
