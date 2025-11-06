-- Bảng Users
CREATE TABLE `Users` (
  `Id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `UserId` VARCHAR(50) NOT NULL UNIQUE,  
  `UserName` VARCHAR(150) NOT NULL,
  `Gender` VARCHAR(20),
  `Birthday` DATE,
  `Email` VARCHAR(255) UNIQUE,
  `PhoneNumber` VARCHAR(50),
  `Password` VARCHAR(255) NOT NULL,
  INDEX `IX_Users_UserName` (`UserName`),
  INDEX `IX_Users_Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Notes
CREATE TABLE `Notes` (
  `Id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `NoteId` VARCHAR(255) NOT NULL UNIQUE,  
  `UserId` BIGINT NOT NULL,               
  `Title` VARCHAR(255) NOT NULL,
  `Content` LONGTEXT,
  `ImageUrl` VARCHAR(1000),
  `IsPublic` BOOLEAN DEFAULT 0,
  CONSTRAINT `FK_Notes_Users` 
    FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`) ON DELETE CASCADE,
  INDEX `IX_Notes_UserId` (`UserId`),
  INDEX `IX_Notes_Title` (`Title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Bảng SharedLinks
CREATE TABLE `SharedLinks` (
  `Id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `NoteId` BIGINT NOT NULL UNIQUE,       
  `Token` VARCHAR(64) NOT NULL UNIQUE,
  `ReadOnly` BOOLEAN DEFAULT 1,
  CONSTRAINT `FK_SharedLinks_Notes` 
    FOREIGN KEY (`NoteId`) REFERENCES `Notes`(`Id`) ON DELETE CASCADE,
  INDEX `IX_SharedLinks_NoteId` (`NoteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;