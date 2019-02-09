-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: Feb 09, 2019 at 02:16 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_petersis`
--

-- --------------------------------------------------------

--
-- Table structure for table `Characters`
--

CREATE TABLE `Characters` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Species` varchar(20) NOT NULL DEFAULT 'Human',
  `Year_released` int(11) NOT NULL,
  `Year_added_to_Smash` int(11) NOT NULL,
  `Series_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Characters_to_Games`
--

CREATE TABLE `Characters_to_Games` (
  `Game_id` int(11) NOT NULL,
  `Character_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Maps_to_Games`
--

CREATE TABLE `Maps_to_Games` (
  `Game_id` int(11) NOT NULL,
  `Map_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Original_Series`
--

CREATE TABLE `Original_Series` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `First_game` varchar(255) DEFAULT NULL,
  `Creation_year` int(11) DEFAULT NULL,
  `Number_of_games` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Smash_Games`
--

CREATE TABLE `Smash_Games` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Year_released` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Smash_Maps`
--

CREATE TABLE `Smash_Maps` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Year_added_to_smash` int(11) DEFAULT NULL,
  `Series_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Characters`
--
ALTER TABLE `Characters`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Series_id` (`Series_id`);

--
-- Indexes for table `Characters_to_Games`
--
ALTER TABLE `Characters_to_Games`
  ADD KEY `Game_id` (`Game_id`),
  ADD KEY `Character_id` (`Character_id`);

--
-- Indexes for table `Maps_to_Games`
--
ALTER TABLE `Maps_to_Games`
  ADD KEY `Game_id` (`Game_id`),
  ADD KEY `Map_id` (`Map_id`);

--
-- Indexes for table `Original_Series`
--
ALTER TABLE `Original_Series`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Smash_Games`
--
ALTER TABLE `Smash_Games`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Smash_Maps`
--
ALTER TABLE `Smash_Maps`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Series_id` (`Series_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Characters`
--
ALTER TABLE `Characters`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Original_Series`
--
ALTER TABLE `Original_Series`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Smash_Games`
--
ALTER TABLE `Smash_Games`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Smash_Maps`
--
ALTER TABLE `Smash_Maps`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Characters`
--
ALTER TABLE `Characters`
  ADD CONSTRAINT `Characters_ibfk_1` FOREIGN KEY (`Series_id`) REFERENCES `Original_Series` (`Id`);

--
-- Constraints for table `Characters_to_Games`
--
ALTER TABLE `Characters_to_Games`
  ADD CONSTRAINT `Characters_to_Games_ibfk_1` FOREIGN KEY (`Game_id`) REFERENCES `Smash_Games` (`Id`),
  ADD CONSTRAINT `Characters_to_Games_ibfk_2` FOREIGN KEY (`Character_id`) REFERENCES `Characters` (`Id`);

--
-- Constraints for table `Maps_to_Games`
--
ALTER TABLE `Maps_to_Games`
  ADD CONSTRAINT `Maps_to_Games_ibfk_1` FOREIGN KEY (`Game_id`) REFERENCES `Smash_Games` (`Id`),
  ADD CONSTRAINT `Maps_to_Games_ibfk_2` FOREIGN KEY (`Map_id`) REFERENCES `Smash_Maps` (`Id`);

--
-- Constraints for table `Smash_Maps`
--
ALTER TABLE `Smash_Maps`
  ADD CONSTRAINT `Smash_Maps_ibfk_1` FOREIGN KEY (`Series_id`) REFERENCES `Original_Series` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
