const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const { sequelize } = require('./admindb');
const { users, posts, categories, posts_categories, comments, commentsLikes, postsLikes } = require('./initTables');

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

const adminBro = new AdminBro({
    Databases: [sequelize],
    resources: [
      {resource: users, options: { parent: UsersParent, properties: { encryptedPassword: { isVisible: false } } }},
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
    },
});

const routerAdmin = AdminBroExpress.buildRouter(adminBro);

module.exports = { routerAdmin, adminBro }