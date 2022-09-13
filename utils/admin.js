const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const { sequelize, users } = require('./db');

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
    Databases: [sequelize],
    rootPath: '/admin',
})

sequelize.sync().then(() => {
    users.findAll({
    }).then(res => {
        res.map((el) => console.log(el.dataValues));
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
}).catch((error) => {
    console.error('Unable to create table : ', error);
})

const routerAdmin = AdminBroExpress.buildRouter(adminBro);

module.exports = { routerAdmin, adminBro }