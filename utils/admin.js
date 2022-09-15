const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const { sequelize } = require('./admindb');
const { users } = require('./initTables');

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
    Databases: [sequelize],
    resources: [{
        resource: users,
        options: {
            properties: {
                password: {
                    type: 'string',
                    isVisible: {
                      list: true, edit: true, filter: false, show: true,
                    }
                },
                profile_img: {
                    type: 'string',
                    isVisible: {
                      list: false, edit: true, filter: false, show: true,
                    }
                }
            },
            actions: {
                new: {
                    before: async (request) => {
                        if(request.payload.password) {
                          request.payload = {
                            ...request.payload,
                            password: await bcrypt.hash(request.payload.password, 10),
                          }
                        }
                        return request
                      },
                }
            }
        }
    }], 
    rootPath: '/admin',
})

const routerAdmin = AdminBroExpress.buildRouter(adminBro);

module.exports = { routerAdmin, adminBro }