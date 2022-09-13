const db = require('../utils/db');

module.exports = class User {
    constructor(table) {
        this.table = table;
    }

    async find(login) {
        const sql = `SELECT * FROM ${this.table} WHERE login = '${login}';`
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        this.id = data[0][0].id;
        this.login = data[0][0].login;
        this.password = data[0][0].password;
        this.fullname = data[0][0].fullname;
        this.email = data[0][0].email;
        this.role = data[0][0].role;
        this.profile_img = data[0][0].profile_img;
        this.rating = data[0][0].rating;
        return this;
    }

    async create(info) {
        let keys = [], values = [];
        let entries = Object.entries(info);
        for(let i = 0; i < entries.length; i++) {
            if(entries[i][0] !== 'passwordRepeat') {
                keys.push(entries[i][0]);
                values.push(`'${entries[i][1]}'`);
            }
        }

        let sql = `INSERT INTO ${this.table} (${keys}) VALUES (${values});`;
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
    }

    async check(info) {
        let sql = `SELECT * FROM ${this.table} WHERE login='${info.login}' AND password='${info.password}';`;
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        if(res[0].length) {
            return res[0][0].login;
        }
        return -1;
    }

    async exists(info) {
        let sql = `SELECT * FROM ${this.table} WHERE login='${info.login}' OR email='${info.email}';`;
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        if(res[0].length) {
            return true;
        }
        return false;
    }

    async findEmail(email) {
        let sql = `SELECT * FROM ${this.table} WHERE email='${email}';`;
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        if(res[0].length) {
            return res[0][0];
        }
        return 0;
    }

    async findID(id) {
        let sql = `SELECT * FROM ${this.table} WHERE id='${id}';`;
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        if(res[0].length) {
            return res[0][0];
        }
        return 0;
    }

    async updatePassword(email, password) {
        let sql = `UPDATE ${this.table} SET password='${password}' WHERE email='${email}';`
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        return;
    }

    async getAllUsers() {
        let sql = `SELECT * FROM ${this.table}`;
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        return res[0];
    }
}