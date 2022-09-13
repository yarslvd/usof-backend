const mysql = require('mysql2');
const { DataTypes, Sequelize } = require("sequelize");
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

const sequelize = new Sequelize(
    process.env.DB,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    login: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "user",
    },
    profile_img: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "profile_images/default.jpg",
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    timestamps: false
});

sequelize.sync().then(() => {
    console.log('Book table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { connect, sequelize, users };