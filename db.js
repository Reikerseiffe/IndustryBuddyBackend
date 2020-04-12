var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.EVE_SDE_HOST,
    user     : process.env.EVE_SDE_USER,
    password : process.env.EVE_SDE_PASSWORD,
    database : process.env.EVE_SDE_DATABASE
});

console.log(process.env.EVE_SDE_HOST)


connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});
//Make connection available for helper classes
module.exports = connection;