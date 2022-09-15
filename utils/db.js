const mysql = require('mysql2');
require('dotenv').config();

const connect = () => {
    const connection = mysql.createConnection({
        host:process.env.HOST,
        user:process.env.USER,
        database:process.env.DB,
        password:process.env.PASSWORD
    });
    connection.connect(function (err) {
        if(err) return console.log(err.message);
        console.log('Connected to Database!');
    });
    return connection;
}

module.exports = { connect };