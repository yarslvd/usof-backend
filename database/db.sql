CREATE DATABASE IF NOT EXISTS usof_backend;
CREATE USER IF NOT EXISTS 'yarslvd'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof_backend.* TO 'yarslvd'@'localhost';

USE usof_backend;

CREATE TABLE IF NOT EXISTS users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    fullname VARCHAR(200) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    profile_img VARCHAR(100) NOT NULL DEFAULT 'profile_images/default.jpg',
    rating INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorID INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    publishDate DATE NOT NULL,
    content TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    FOREIGN KEY (authorID) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories
(
    id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    name VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS posts_categories
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    categoryID INT NOT NULL,
    FOREIGN KEY (postID) REFERENCES posts(id),
    FOREIGN KEY (categoryID) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS comments
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorID INT NOT NULL,
    postID INT NOT NULL,
    publishDate DATE NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (authorID) REFERENCES users(id),
    FOREIGN KEY (postID) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS postsLikes
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorID INT,
    postID INT,
    publishDate DATE NOT NULL,
    type ENUM('like', 'dislike'),
    FOREIGN KEY (authorID) REFERENCES users(id),
    FOREIGN KEY (postID) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS commentsLikes
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorID INT,
    commentID INT,
    publishDate DATE NOT NULL,
    type ENUM('like', 'dislike'),
    FOREIGN KEY (authorID) REFERENCES users(id),
    FOREIGN KEY (commentID) REFERENCES comments(id)
);