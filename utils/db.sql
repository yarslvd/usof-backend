CREATE DATABASE IF NOT EXISTS usof_backend;
CREATE USER IF NOT EXISTS 'yarslvd'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof_backend.* TO 'yarslvd'@'localhost';

USE usof_backend;

CREATE TABLE IF NOT EXISTS users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    profile_img VARCHAR(100) NOT NULL DEFAULT 'profile_images/default.jpg',
    rating INT NOT NULL DEFAULT 0
);