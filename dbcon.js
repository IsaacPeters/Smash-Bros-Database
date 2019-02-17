const mysql = require('mysql');

const osu = {
	connectionLimit : 10,
	host            : 'classmysql.engr.oregonstate.edu',
	user            : 'cs340_nichojos', 	// replace YOURONID with your ONID u/n (what comes before @oregonstate.edu for your email/login credentials)
	password        : '4131',	// replace with your password -- if left as the default, it should be the last 4 digits of your student ID
	database        : 'cs340_nichojos'	// see comment for 'user' key above
};

let pool = mysql.createPool(osu);

module.exports.pool = pool;