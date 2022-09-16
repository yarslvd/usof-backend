const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require('./admindb');

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

const posts = sequelize.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    authorID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    publishDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false
});

const categories = sequelize.define('categories',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(40)
    }
}, {
    timestamps: false
});

const posts_categories = sequelize.define('posts_categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    postID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    authorID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

const comments = sequelize.define('comments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    authorID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    postID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    publishDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
});

// Adding foreign keys
//posts_categories.belongsTo(users);

categories.belongsToMany(posts, {through: posts_categories});
posts.belongsToMany(categories, {through: posts_categories});

//posts.belongsTo(users);

sequelize.sync().then(() => {
    console.log('Book table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { users, posts, categories, posts_categories, comments };