USE usof_backend;

INSERT INTO users (login, password, fullname, email, role)
VALUES
('ydoroshenk', 'password', 'Yaroslav Doroshenko', 'awdawdw@gmail.com', 'admin'),
('yarslvd', 'password2', 'My Second', 'asdfsdfw@gmail.com', 'user'),
('limix', 'password3', 'Ihor Doroshenko', 'idoroshenko@gmail.com', 'user'),
('daripon', 'darino4ka', 'Darina Udod', 'dudod@gmail.com', 'user');

INSERT INTO posts (authorID, title, publishDate, content, status)
VALUES
(1, 'Hello', '2022-09-10', 'Whats up?', 1),
(2, 'Hello', '2022-09-10', 'Im a new here', 1),
(3, 'How to use it', '2022-09-12', 'What is the main idea of this community?', 1),
(3, 'C++ error', '2022-09-12', 'Can you explain this', 1),
(3, 'New admin', '2022-09-15', 'I need new admin for', 1);

INSERT INTO comments (authorID, postID, publishDate, content)
VALUES
(2, 1, '2022-09-12', 'Great'),
(3, 2, '2022-09-13', 'Me too'),
(1, 3, '2022-09-15', 'Sry cant help you');

INSERT INTO categories (name)
VALUES
('ADMIN INFO'),
('COMMUNITY STUCTURE'),
('GENERAL'),
('PLAY TOGETHER'),
('WORLD NEWS DISCUSS'),
('COMPUTER / DEVELOP');

INSERT INTO posts_categories (postID, categoryID)
VALUES
(1, 1),
(2, 1),
(3, 2),
(3, 1),
(4, 3),
(5, 4);

INSERT INTO postsLikes (authorID, postID, publishDate, type)
VALUES
(1, 2, '2022-09-12', 'like'),
(3, 1, '2022-09-12', 'like'),
(2, 1, '2022-09-12', 'dislike'),
(1, 3, '2022-09-12', 'like');