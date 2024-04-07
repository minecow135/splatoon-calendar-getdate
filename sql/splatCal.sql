-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 08, 2024 at 01:20 AM
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
-- Table structure for table `splatCal`
--

CREATE TABLE `splatCal` (
  `id` int NOT NULL,
  `event` varchar(10) NOT NULL,
  `title` varchar(20) NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `startDate` datetime NOT NULL,
  `created` datetime NOT NULL,
  `duration` int NOT NULL,
  `uid` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `splatCal`
--

INSERT INTO `splatCal` (`id`, `event`, `title`, `description`, `startDate`, `created`, `duration`, `uid`) VALUES
(11, 'splatfest', 'Splatfest', 'Global\nBaby Chicks vs. Li\'l Bunnies vs. Bear Cubs\nhttps://splatoonwiki.org/wiki/Baby_Chicks_vs._Li%27l_Bunnies_vs._Bear_Cubs\n\n', '2024-04-20 02:00:00', '2024-04-08 00:48:31', 2, '1kTf4N6hiZO_oUvHjMz01@splatfest.awdawd.eu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `splatCal`
--
ALTER TABLE `splatCal`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `splatCal`
--
ALTER TABLE `splatCal`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
