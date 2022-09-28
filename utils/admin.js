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
    encryptedPassword: {
      isVisible: false,
    },
    password: {
      type: 'string',
      isVisible: {
        list: false, edit: true, filter: false, show: false,
      },
    }
  },
  actions: {
    new: {
      before: async(response) => {
        let password = response.payload.password;
        console.log(password);
        let login = response.payload.login;
        if (!login || login.length < 3) {
          throw new AdminBro.ValidationError({
            name: {
              message: 'Login should contain more than 3 letter',
            },
          },{
            message: 'Some error has occured',
          })
        }
        if(!password || password.length < 8) {
          throw new AdminBro.ValidationError({
            name: {
              message: 'Password should contain more than 8 characters',
            },
            },{
              message: 'Some error has occured',
          })
        }
        response.payload.password = await bcrypt.hash(request.payload.password, 12);
        console.log(response.payload.password)
        return response
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