SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `currentplayer`;
CREATE TABLE `currentplayer` (
  `currentplayer` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

TRUNCATE TABLE `currentplayer`;
INSERT INTO `currentplayer` (`currentplayer`) VALUES
('X');

DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
  `cell_id` varchar(5) NOT NULL,
  `value` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

TRUNCATE TABLE `game`;
INSERT INTO `game` (`cell_id`, `value`) VALUES
('c1', '0'),
('c2', '0'),
('c3', '0'),
('c4', '0'),
('c5', '0'),
('c6', '0'),
('c7', '0'),
('c8', '0'),
('c9', '0');

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

TRUNCATE TABLE `status`;
INSERT INTO `status` (`status`) VALUES
('X');
COMMIT;

