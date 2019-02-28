-- get all values from Characters table -- including series name
SELECT C.Id, C.Name, C.Species, C.Year_released, C.Year_added_to_Smash, OS.Name AS Series_Name FROM Characters C JOIN Original_Series OS ON OS.Id = C.Series_id)

-- get all values from Characters table that share a series
SELECT C.Id, C.Name, C.Species, C.Year_released, C.Year_added_to_Smash, OS.Name AS Series_Name FROM Characters C JOIN Original_Series OS ON OS.Id = C.Series_id WHERE OS.Name = :desired_series_name)

-- get all character names
SELECT Name FROM Characters;

-- get all values from Smash_Maps table -- including series name
SELECT m.Id, m.Name, m.Year_added_to_Smash, os.Name AS Series_Name FROM Smash_Maps m JOIN Original_Series os ON os.Id = m.Series_id;

--get all values from Maps table that share a series
SELECT m.Id, m.Name, m.Year_added_to_Smash, os.Name AS Series_Name FROM Smash_Maps m JOIN Original_Series os ON os.Id = m.Series_id WHERE os.Name = :desired_series_name;

--get all map names
SELECT Name FROM Smash_Maps;

-- get all values from Original_Series table
SELECT (`Id`, `Name`, `First_game`, `Creation_year`, `Number_of_games`) FROM Original_Series;

-- get all values from Smash_Games table
SELECT (`Id`, `Name`, `Creation_year`) FROM Smash_Games;

--get all game names
SELECT Name FROM Smash_Games;

--get all characters from a particular game
SELECT c.Name FROM Characters c JOIN Characters_to_Games cg ON cg.Character_id = c.Id JOIN Smash_Games g ON g.Id = cg.Game_id WHERE g.Name = :smash_game;

--get all maps from a particular game
SELECT m.Name FROM Smash_Maps m JOIN Maps_to_Games mg ON mg.Map_id = m.Id JOIN Smash_Games g ON g.Id = mg.Game_id WHERE g.Name = :smash_game;

-- get all values from Original_Series table
SELECT (`Id`, `Name`, `First_game`, `Creation_year`, `Number_of_games`) FROM Original_Series;

--get all original series names
SELECT Name FROM Original_Series;

--get all character to game relationships
SELECT c.Name AS Character_Name, g.Name AS Game_Name FROM Characters c JOIN Characters_to_Games cg ON c.Id = cg.Character_id JOIN Smash_Games g ON g.Id = cg.Game_id;

--get all map to game relationships
SELECT m.Name AS Map_Name, g.Name AS Game_Name FROM Smash_Maps m JOIN Maps_to_Games mg ON m.Id = mg.Map_id JOIN Smash_Games g ON g.Id = mg.Game_id;

-- delete value form Characters table
DELETE FROM Characters WHERE Id = :character_id

--delete value from Smash_Maps table
DELETE FROM Smash_Maps WHERE Id = :map_id

--delete value from Original_Series table
DELETE FROM Original_Series WHERE Id = :series_id;

--delete value from Smash_Games table
DELETE FROM Smash_Games WHERE Id = :game_id;

--Insert a new Character
INSERT INTO `Characters` (`Name`, `Species`, `Year_released`, `Year_added_to_Smash`, `Series_id`) VALUES (:character_name, :character_species, :character_creation_year, :character_smash_release, (SELECT Id FROM Original_Series WHERE Name = :character_series_name));

--Insert a new Smash Map
INSERT INTO `Smash_Maps` (`Name`, `Year_added_to_Smash`, `Series_id`) VALUES (:map_name, :map_smash_release, (SELECT Id FROM Original_Series WHERE Name = :character_series_name));

--Insert a new Original Series
INSERT INTO `Original_Series` (`Name`, `First_game`, `Creation_year`, `Number_of_games`) VALUES (:series_name, :series_creation_year, :series_number_of_games);

--Insert a new Smash Game
INSERT INTO `Smash_Games` (`Name`, `Creation_year`) VALUES (:smash_name, :smash_creation_year);

--Insert a new character to game relationships
INSERT INTO Characters_to_Games (`Character_id`, `Game_id`) VALUES ((SELECT Id FROM Characters WHERE Name = :character_name),(SELECT Id FROM Smash_Games WHERE Name = :game_name));

--Insert a new map to game relationship
INSERT INTO Maps_to_Games (`Map_id`, `Game_id`) VALUES ((SELECT Id FROM Smash_Maps WHERE Name = :map_name),(SELECT Id FROM Smash_Games WHERE Name = :game_name))

-- Note, I created the next queries in string format so we can more easily import them
--  into our project

-- Update Character
"UPDATE Characters SET Name=?, Species=?, Year_released=?, Smash_year=?, Series_id=? WHERE id=?",
    [:NameInput || currentName, :SpeciesInput || currentSpecies, :Year_releasedInput || currentYear_released, :Smash_yearInput || currentSmash_year, :Series_id_from_dropdownInput || currentSeries_id, :idToUpdate]

-- Update Original Series
"UPDATE Original_series SET Name=?, First_game=?, Creation_year=?, Number_of_games=? WHERE id=?",
    [:NameInput || currentName, :First_gameInput || currentFirst_game, :Creation_yearInput || currentCreation_year, :Number_of_gamesInput || currentNumber_of_games, :idToUpdate]

-- Update Smash Game
"UPDATE Smash_games SET Name=?, Year_released=? WHERE id=?",
    [:NameInput || currentName, :Year_releasedInput || currentYear_released, :idToUpdate]

-- Update Smash Map
"UPDATE Smash_maps SET Name=?, Year_added_to_smash=?, Original_series=? WHERE id=?",
    [:NameInput || currentName, :Year_added_to_smashInput || currentYear_added_to_smash, :Series_id_from_dropdownInput || currentSeries_id, :idToUpdate]
