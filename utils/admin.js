const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const { sequelize } = require('./admindb');
const { users, posts, categories, posts_categories, comments } = require('./initTables');

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
    Databases: [sequelize],
    resources: [{resource: users}, {resource: posts}, {resource: categories},
      {resource: posts_categories}, {resource: comments}], 
    rootPath: '/admin',
});

const routerAdmin = AdminBroExpress.buildRouter(adminBro);

module.exports = { routerAdmin, adminBro }