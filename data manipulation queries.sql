-- get all values from Characters table
SELECT * FROM Characters;

-- get all values from Characters table that share a series
SELECT * FROM Characters WHERE Series_id = :desired_series;

-- get all values from Smash_Maps table
SELECT * FROM Smash_Maps;

-- get all values from Smash_Games table
SELECT * FROM Smash_Games;

-- get all values from Original_Series table
SELECT * FROM Original_Series;

-- delete value form Characters table
DELETE FROM Characters WHERE Id = :character_id

--delete value from Smash_Maps table
DELETE FROM Smash_Maps WHERE Id = :map_id

--delete value from Original_Series table
DELETE FROM Original_Series WHERE Id = :series_id;

--delete value from Smash_Games table
DELETE FROM Smash_Games WHERE Id = :game_id;

--Insert a new Character
INSERT INTO `Characters` (`Id`, `Name`, `Species`, `Year_released`, `Year_added_to_Smash`, `Series_id`) VALUES (NULL, :character_name, :character_species, :character_creation_year, :character_smash_release, :character_series_id);

--Insert a new Smash Map
INSERT INTO `Smash_Maps` (`Id`, `Name`, `Year_added_to_Smash`, `Series_id`) VALUES (NULL, :map_name, :map_smash_release, :map_series_id);

--Insert a new Original Series
INSERT INTO `Original_Series` (`Id`, `Name`, `First_game`, `Creation_year`, `Number_of_games`) VALUES (NULL, :series_name, :series_creation_year, :series_number_of_games);

--Insert a new Smash Game
INSERT INTO `Original_Series` (`Id`, `Name`, `Creation_year`) VALUES (NULL, :smash_name, :smash_creation_year);