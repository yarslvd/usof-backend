const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroSequelize = require('@admin-bro/sequelize');
const { sequelize } = require('./admindb');
const { users, posts, categories, posts_categories, comments, commentsLikes, postsLikes } = require('./initTables');
const bcrypt = require('bcrypt');
require('dotenv').config();

AdminBro.registerAdapter(AdminBroSequelize);

const LikesParent = {
  name: 'Likes',
  icon: 'Favorite'
}

const UsersParent = {
  name: 'Users',
  icon: 'User'
}

const PostsParent = {
  name: 'Posts',
  icon: 'Account'
}

const CategoriesParent = {
  name: 'Categories',
  icon: 'Categories'
}
 
const CommentsParent = {
  name: 'Comments',
  icon: 'Chat'
}

const usersOptions = {
  parent: UsersParent,
  properties: {
    newPassword: {
      type: 'string',
      isVisible: {
        list: false, edit: true, filter: false, show: false,
      }
    },
    password: {
      isVisible: false,
    }
  },
  actions: {
    new: {
      before: async (request) => {
        if(request.payload.newPassword) {
          request.payload = {
            ...request.payload,
            password: await bcrypt.hash(request.payload.newPassword, 12),
            newPassword: undefined,
          }
        }
        return request
      }
    },
    edit: {
      before: async (request) => {
        if(request.payload.newPassword) {
          request.payload = {
            ...request.payload,
            password: await bcrypt.hash(request.payload.newPassword, 12),
            newPassword: undefined,
          }
        }
        return request
      }
    }
  }
}

const adminBro = new AdminBro({
  Databases: [sequelize],
  resources: [
    {resource: users, options: usersOptions },
    {resource: posts, options: { parent: PostsParent }},
    {resource: categories, options: { parent: CategoriesParent }},
    {resource: posts_categories, options: { parent: CategoriesParent }},
    {resource: comments, options: { parent: CommentsParent }},
    {resource: commentsLikes, options: { parent: LikesParent }},
    {resource: postsLikes, options: { parent: LikesParent}}
  ], 
  rootPath: '/admin',
  branding: {
    companyName: 'Admin Panel',
  }
});

const routerAdmin = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    try {
      let user = await users.findOne({ where: {email: email} });

      if (user && user.role === 'admin') {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
          return user;
        }
      }
      return false;
    }
    catch(err) {
      console.error(err);
    }
  },
  cookiePassword: process.env.SECURE_TOKEN,
});

module.exports = { routerAdmin, adminBro }