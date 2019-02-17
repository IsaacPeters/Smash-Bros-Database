var express = require('express');
var mysql = require('./dbcon.js');

var path = require('path');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 1920);
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

app.get('/fill_characters',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM Characters', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/fill_series',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM Original_Series', function(err, rows, fields){
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
    mysql.pool.query('SELECT * FROM Smash_Games', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/fill_maps',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM Smash_Maps', function(err, rows, fields){
        if(err){
            console.log("ran into an error");
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.get('/fill_characters_by_series',function(req,res,next){
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

app.get('/fill_smash_games_dropdown',function(req,res,next){
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

app.get('/insert',function(req,res,next){
    var context = {};
    //console.log(req.query);
    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Inserted id " + result.insertId;
        res.send(context);
    });
});

app.get('/update',function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        if(result.length == 1){
            var curVals = result[0];
            mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
            [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
            function(err, result){
            if(err){
                next(err);
                return;
            }
            context.results = "Updated " + result.changedRows + " rows.";
            res.render('home',context);
            });
        }
    });
});

app.get('/delete',function(req,res,next){
    var context = {};
    //console.log(req.query);
    mysql.pool.query("DELETE FROM Characters WHERE Id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Results" + result.removeId;
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