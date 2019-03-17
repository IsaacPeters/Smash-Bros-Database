var express = require('express');
var mysql = require('./dbcon.js');

var path = require('path');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3141);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.render('home');
});

app.get('/Smash_maps',function(req,res){
    res.render('Smash_maps');
});

app.get('/Smash_games',function(req,res){
    res.render('Smash_games');
});

app.get('/Original_series',function(req,res){
    res.render('Original_series');
});

app.get('/Characters',function(req,res){
    res.render('characters');
});

app.get('/Maps_to_games',function(req,res){
    res.render('Maps_to_games');
});

app.get('/Characters_to_games',function(req,res){
    res.render('Characters_to_games');
});

app.get('/fill_characters',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT C.Id, C.Name, C.Species, C.Year_released, C.Year_added_to_Smash, OS.Name AS Series_Name FROM Characters C JOIN Original_Series OS ON OS.Id = C.Series_id ORDER BY C.Name ASC', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/filter_characters',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT C.Id, C.Name, C.Species, C.Year_released, C.Year_added_to_Smash, OS.Name AS Series_Name FROM Characters C JOIN Original_Series OS ON OS.Id = C.Series_id WHERE OS.Name = ?', [req.query.Series_Name], function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/insert_Character',function(req,res,next){
    var context = {};
	mysql.pool.query('INSERT INTO Characters (`Name`, `Species`, `Year_released`, `Year_added_to_Smash`, `Series_id`) VALUES (?, ?, ?, ?,(SELECT Id FROM Original_Series WHERE Name = ?))', 
        [req.query.name, req.query.species, req.query.year_released, req.query.smash_year, req.query.Series_dropdown], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.send(context);
	});
});

app.get('/fill_dropdown_by_character',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT Name FROM Characters', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/update_character', function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT * FROM Characters WHERE id=?", [req.query.id], function(err,result) {
    if(err) {
        console.log(err);
        return;
    }
    if(result.length == 1){
        mysql.pool.query("UPDATE Characters c SET c.Name=?, c.Species=?, c.Year_Released=?, c.Year_added_to_Smash=?, Series_id=(SELECT Id FROM Original_Series WHERE Name = ?) WHERE id=? ",
        [req.query.name || curVals.name, req.query.species || curVals.species, req.query.year_released || curVals.year_released, req.query.smash_year || curVals.smash_year, req.query.Series_dropdown , req.query.id],
        function(err, result){
            if(err){
                next(err);
                return;
            }
            context.results = JSON.stringify(result);
            res.send(context);
        });
    }
    });
});

app.get('/delete_character',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE FROM Characters WHERE Id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});

app.get('/delete_character_relation',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE FROM Characters_to_Games WHERE Character_id=?", [req.query.character_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});

app.get('/fill_maps',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT m.Id, m.Name, m.Year_added_to_Smash, os.Name AS Series_Name FROM Smash_Maps m JOIN Original_Series os ON os.Id = m.Series_id ORDER BY m.Name ASC', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/filter_maps',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT m.Id, m.Name, m.Year_added_to_Smash, os.Name AS Series_Name FROM Smash_Maps m JOIN Original_Series os ON os.Id = m.Series_id WHERE os.Name = ?', [req.query.Series_Name], function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/insert_map',function(req,res,next){
    var context = {};
	mysql.pool.query('INSERT INTO Smash_Maps (`Name`, `Year_added_to_Smash`, `Series_id`) VALUES (?, ?,(SELECT Id FROM Original_Series WHERE Name = ?))', 
	[req.query.name, req.query.smash_year, req.query.Series_dropdown], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.send(context);
	});
});

app.get('/update_map', function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM Smash_Maps WHERE id = ' + req.query.id, function(err,rows,fields) {
    if(err) {
        console.log(err);
        return;
    }
    if(rows.length == 1){
        mysql.pool.query("UPDATE Smash_Maps c SET c.Name=?, c.Year_added_to_smash=?, Series_id=(SELECT Id FROM Original_Series WHERE Name = ?) WHERE id=? ",
        [req.query.name || curVals.name, req.query.smash_year || curVals.smash_year, req.query.Series_dropdown  || curVals.Series_dropdown, req.query.id],
        function(err, result){
            if(err){
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.send(context);
        });
    }
    });
});

app.get('/delete_map',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE FROM Smash_Maps WHERE Id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});

app.get('/delete_map_relation',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE FROM Maps_to_Games WHERE Map_id=?", [req.query.map_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});


app.get('/fill_dropdown_by_map',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT Name FROM Smash_Maps', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/fill_smash',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT Id, Name, Year_released FROM Smash_Games ORDER BY Year_released ASC', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/search_games_characters',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT c.Name FROM Characters c JOIN Characters_to_Games cg ON cg.Character_id = c.Id JOIN Smash_Games g ON g.Id = cg.Game_id WHERE g.Name = ?  ',
	[req.query.game_name], function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/search_games_maps',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT m.Name FROM Smash_Maps m JOIN Maps_to_Games mg ON mg.Map_id = m.Id JOIN Smash_Games g ON g.Id = mg.Game_id WHERE g.Name = ?  ',
	[req.query.game_name], function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/insert_smash',function(req,res,next){
    var context = {};
	mysql.pool.query('INSERT INTO Smash_Games (`Name`, `Year_released`) VALUES (?, ?)', 
	[req.query.smash_name, req.query.smash_year_released], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.send(context);
	});
});

app.get('/fill_dropdown_by_smash',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT Name FROM Smash_Games', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/delete_smash',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE FROM Smash_Games WHERE Id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});

app.get('/delete_smash_relation',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE cg, mg FROM Characters_to_Games cg JOIN Maps_to_Games mg ON cg.Game_id = mg.Game_id WHERE mg.Game_id = ?", [req.query.game_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});

app.get('/fill_series',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT Id, Name, First_game, Creation_year, Number_of_games FROM Original_Series ORDER BY Id = 0 DESC, Creation_year ASC', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/insert_series',function(req,res,next){
    var context = {};
	mysql.pool.query('INSERT INTO Original_Series (`Name`, `First_game`, `Creation_year`, `Number_of_games`) VALUES (?, ?, ?, ?)', 
	[req.query.series_name, req.query.series_first_game, req.query.series_creation_year, req.query.series_number_of_games], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.send(context);
	});
});
app.get('/fill_dropdown_by_series',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT Name FROM Original_Series', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/delete_series',function(req,res,next){
    var context = {};
    mysql.pool.query("DELETE FROM Original_Series WHERE Id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
    });
});

app.get('/remove_series_relation',function(req,res,next){
    var context = {};
    mysql.pool.query("UPDATE Characters SET Series_id = 0 WHERE Series_id = ?", [req.query.series_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        mysql.pool.query("UPDATE Smash_Maps SET Series_id = 0 WHERE Series_id = ?", [req.query.series_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
        res.send(context);
        });
    });
});


app.get('/fill_cg',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT DISTINCT c.Name AS Character_Name, g.Name AS Game_Name FROM Characters c JOIN Characters_to_Games cg ON c.Id = cg.Character_id JOIN Smash_Games g ON g.Id = cg.Game_id ORDER BY cg.Character_id ASC', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/insert_cg',function(req,res,next){
    var context = {};
	mysql.pool.query('INSERT INTO Characters_to_Games (`Character_id`, `Game_id`) VALUES ((SELECT Id FROM Characters WHERE Name = ?),(SELECT Id FROM Smash_Games WHERE Name = ?))', 
	[req.query.smash_characters_dropdown, req.query.smash_games_dropdown], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.send(context);
	});
});

app.get('/delete_cg',function(req,res,next){
    var context = {};
    mysql.pool.query('DELETE FROM Characters_to_Games WHERE Character_id = (SELECT Id FROM Characters WHERE Name = ?) AND Game_id = (SELECT Id FROM Smash_Games WHERE Name = ?)', 
    [req.query.Character_id, req.query.Game_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(context);
    });
});


app.get('/fill_mg',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT DISTINCT m.Name AS Map_Name, g.Name AS Game_Name FROM Smash_Maps m JOIN Maps_to_Games mg ON m.Id = mg.Map_id JOIN Smash_Games g ON g.Id = mg.Game_id ORDER BY mg.Map_id ASC', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/insert_mg',function(req,res,next){
    var context = {};
	mysql.pool.query('INSERT INTO Maps_to_Games (`Map_id`, `Game_id`) VALUES ((SELECT Id FROM Smash_Maps WHERE Name = ?),(SELECT Id FROM Smash_Games WHERE Name = ?))', 
	[req.query.smash_maps_dropdown, req.query.smash_games_dropdown], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.send(context);
	});
});

app.get('/delete_mg',function(req,res,next){
    var context = {};
    mysql.pool.query('DELETE FROM Maps_to_Games WHERE Map_id = (SELECT Id FROM Smash_Maps WHERE Name = ?) AND Game_id = (SELECT Id FROM Smash_Games WHERE Name = ?)', 
    [req.query.Map_id, req.query.Game_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(context);
    });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});