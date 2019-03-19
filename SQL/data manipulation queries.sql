-- get all values from Characters table alphabetically by character name -- including series name 
SELECT C.Id, C.Name, C.Species, C.Year_released, C.Year_added_to_Smash, OS.Name AS Series_Name FROM Characters C JOIN Original_Series OS ON OS.Id = C.Series_id ORDER BY C.Name ASC)

-- get all values from Characters table alphabetically by character name that share a series
SELECT C.Id, C.Name, C.Species, C.Year_released, C.Year_added_to_Smash, OS.Name AS Series_Name FROM Characters C JOIN Original_Series OS ON OS.Id = C.Series_id WHERE OS.Name = :desired_series_name ORDER BY C.Name ASC)

-- get all character names
SELECT Name FROM Characters;

-- get all values from Smash_Maps table alphabetically by map name -- including series name
SELECT m.Id, m.Name, m.Year_added_to_Smash, os.Name AS Series_Name FROM Smash_Maps m JOIN Original_Series os ON os.Id = m.Series_id ORDER BY m.Name ASC;

--get all values from Maps table alphabetically by map name that share a series
SELECT m.Id, m.Name, m.Year_added_to_Smash, os.Name AS Series_Name FROM Smash_Maps m JOIN Original_Series os ON os.Id = m.Series_id WHERE os.Name = :desired_series_name ORDER BY m.Name ASC;

--get all map names
SELECT Name FROM Smash_Maps;

-- get all values from Smash_Games table ordered by the year they were released
SELECT Id, Name, Creation_year FROM Smash_Games ORDER BY Year_released ASC;

--get all game names
SELECT Name FROM Smash_Games;

--get all characters from a particular game
SELECT c.Name FROM Characters c JOIN Characters_to_Games cg ON cg.Character_id = c.Id JOIN Smash_Games g ON g.Id = cg.Game_id WHERE g.Name = :smash_game;

--get all maps from a particular game
SELECT m.Name FROM Smash_Maps m JOIN Maps_to_Games mg ON mg.Map_id = m.Id JOIN Smash_Games g ON g.Id = mg.Game_id WHERE g.Name = :smash_game;

-- get all values from Original_Series table ordered by the year of the series debut (After the Smash Series Id 0 is put at the top)
SELECT SELECT Id, Name, First_game, Creation_year, Number_of_games FROM Original_Series ORDER BY Id = 0 DESC, Creation_year ASC;

--get all original series names
SELECT Name FROM Original_Series;

--get all character to game relationships ordered by the Character's ID
SELECT DISTINCT cg.Character_id, cg.Game_id, c.Name AS Character_Name, g.Name AS Game_Name FROM Characters c JOIN Characters_to_Games cg ON c.Id = cg.Character_id JOIN Smash_Games g ON g.Id = cg.Game_id ORDER BY cg.Character_id ASC;

--get all map to game relationships ordered by the Map's ID
SELECT DISTINCT mg.Map_id, mg.Game_id, m.Name AS Map_Name, g.Name AS Game_Name FROM Smash_Maps m JOIN Maps_to_Games mg ON m.Id = mg.Map_id JOIN Smash_Games g ON g.Id = mg.Game_id ORDER BY mg.Map_id ASC;

-- delete value form Characters table
DELETE FROM Characters WHERE Id = :character_id

--delete all realtionships with a character that is being deleted
DELETE FROM Characters_to_Games WHERE Character_id=:character_id;

--delete value from Smash_Maps table
DELETE FROM Smash_Maps WHERE Id = :map_id

--delete all relationships with a map that is being deleted
DELETE FROM Maps_to_Games WHERE Map_id=:map_id

--delete value from Original_Series table
DELETE FROM Original_Series WHERE Id = :series_id;

--update all characters that have a series that is being deleted
UPDATE Characters SET Series_id = 0 WHERE Series_id = :series_id

--update all maps that have a series this is being deleted
UPDATE Smash_Maps SET Series_id = 0 WHERE Series_id = :series_id

--delete value from Smash_Games table
DELETE FROM Smash_Games WHERE Id = :game_id;

--delete all relationships (both Characters and Maps) with a game that is being deleted
DELETE cg, mg FROM Characters_to_Games cg JOIN Maps_to_Games mg ON cg.Game_id = mg.Game_id WHERE mg.Game_id = :game_id;

--delete relationship from Characters_to_Games
DELETE FROM Characters_to_Games WHERE Character_id = (SELECT Id FROM Characters WHERE Name = :character_name) AND Game_id = (SELECT Id FROM Smash_Games WHERE Name = :game_name);

--delete relationship from Maps_to_Games
DELETE FROM Maps_to_Games WHERE Map_id = (SELECT Id FROM Smash_Maps WHERE Name = :map_name) AND Game_id = (SELECT Id FROM Smash_Games WHERE Name = :game_name);

--Insert a new Character
INSERT INTO Characters (`Name`, `Species`, `Year_released`, `Year_added_to_Smash`, `Series_id`) VALUES (:character_name, :character_species, :character_creation_year, :character_smash_release, (SELECT Id FROM Original_Series WHERE Name = :character_series_name));

--Insert a new Smash Map
INSERT INTO Smash_Maps (`Name`, `Year_added_to_Smash`, `Series_id`) VALUES (:map_name, :map_smash_release, (SELECT Id FROM Original_Series WHERE Name = :character_series_name));

--Insert a new Original Series
INSERT INTO Original_Series (`Name`, `First_game`, `Creation_year`, `Number_of_games`) VALUES (:series_name, :series_first_game, :series_creation_year, :series_number_of_games);

--Insert a new Smash Game
INSERT INTO Smash_Games (`Name`, `Creation_year`) VALUES (:smash_name, :smash_creation_year);

--Insert a new character to game relationships
INSERT INTO Characters_to_Games (`Character_id`, `Game_id`) VALUES ((SELECT Id FROM Characters WHERE Name = :character_name),(SELECT Id FROM Smash_Games WHERE Name = :game_name));

--Insert a new map to game relationship
INSERT INTO Maps_to_Games (`Map_id`, `Game_id`) VALUES ((SELECT Id FROM Smash_Maps WHERE Name = :map_name),(SELECT Id FROM Smash_Games WHERE Name = :game_name))

-- Update Character
UPDATE Characters c SET c.Name=:character_name, c.Species=:character_species, c.Year_Released=:character_creation_year, c.Year_added_to_Smash=:character_smash_release, Series_id=(SELECT Id FROM Original_Series WHERE Name = :Series_name) WHERE id= :character_id; 

-- Update Smash Map
UPDATE Smash_Maps c SET c.Name=:map_name, c.Year_added_to_smash=:map_smash_release, Series_id=(SELECT Id FROM Original_Series WHERE Name = :series_name) WHERE id=:map_id;

-- Update Smash Game
UPDATE Smash_Games c SET c.Name=:smash_name, c.Year_Released=:smash_creation_year WHERE id=:smash_id;

-- Update Smash Map
UPDATE Original_Series c SET c.Name=:series_name, c.First_game=:series_first_game, c.Creation_year=:series_creation_year, c.Number_of_games=:series_number_of_games WHERE id=:series_id;

-- Update character to game relationship
UPDATE Characters_to_Games SET Character_id = (SELECT Id FROM Characters WHERE Name = :character_name), Game_id = (SELECT Id FROM Smash_Games WHERE Name = :smash_name) WHERE Character_id = :character_id AND Game_id = :smash_id;

--Update map to game relationship
UPDATE Maps_to_Games SET Map_id = (SELECT Id FROM Smash_Maps WHERE Name = :map_name), Game_id = (SELECT Id FROM Smash_Games WHERE Name = :smash_name) WHERE Map_id = :map_id AND Game_id = :smash_id;