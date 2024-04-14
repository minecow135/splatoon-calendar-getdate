-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 14, 2024 at 04:01 AM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `splatCal`
--

-- --------------------------------------------------------

--
-- Table structure for table `dataTypes`
--

CREATE TABLE `dataTypes` (
  `id` int NOT NULL,
  `dataType` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dataTypes`
--

INSERT INTO `dataTypes` (`id`, `dataType`) VALUES
(1, 'Name'),
(2, 'Location'),
(3, 'Link'),
(4, 'Team');

-- --------------------------------------------------------

--
-- Table structure for table `descData`
--

CREATE TABLE `descData` (
  `id` int NOT NULL,
  `calId` int NOT NULL,
  `locationNum` int NOT NULL,
  `dataCalId` int NOT NULL,
  `dataTypeId` int NOT NULL,
  `data` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `descData`
--

INSERT INTO `descData` (`id`, `calId`, `locationNum`, `dataCalId`, `dataTypeId`, `data`) VALUES
(148, 55, 1, 1, 1, 'Splatfest'),
(149, 55, 1, 2, 2, 'Global'),
(150, 55, 1, 3, 3, 'https://splatoonwiki.org/wiki/Baby_Chicks_vs._Li%27l_Bunnies_vs._Bear_Cubs'),
(151, 55, 1, 4, 4, 'Baby Chicks'),
(152, 55, 1, 5, 4, 'Li\'l Bunnies'),
(153, 55, 1, 6, 4, 'Bear Cubs');

-- --------------------------------------------------------

--
-- Table structure for table `splatCal`
--

CREATE TABLE `splatCal` (
  `id` int NOT NULL,
  `event` varchar(10) NOT NULL,
  `title` varchar(20) NOT NULL,
  `startDate` datetime NOT NULL,
  `created` datetime NOT NULL,
  `duration` int NOT NULL,
  `uid` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `splatCal`
--

INSERT INTO `splatCal` (`id`, `event`, `title`, `startDate`, `created`, `duration`, `uid`) VALUES
(55, 'splatfest', 'Splatfest', '2024-04-20 02:00:00', '2024-04-14 03:59:19', 2, 'lqX0XlsSDhmuwYNHnbYTu@splatfest.awdawd.eu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dataTypes`
--
ALTER TABLE `dataTypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `descData`
--
ALTER TABLE `descData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `splatCal`
--
ALTER TABLE `splatCal`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dataTypes`
--
ALTER TABLE `dataTypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `descData`
--
ALTER TABLE `descData`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `splatCal`
--
ALTER TABLE `splatCal`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
