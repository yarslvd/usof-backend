USE usof_backend;

INSERT INTO users (login, password, fullname, email, role)
VALUES
('yarslvd', 'ydMrFfz2HC', 'Yaroslav Doroshenko', 'yarslvd@gmail.com', 'admin'),
('bnjimst', 'bnjimst123', 'Benji Mstislav', 'bnjimst@gmail.com', 'user'),
('kyianna', 'password3', 'Kenrick Yianna', 'kyianna@gmail.com', 'user'),
('gerald123', 'awdwa23Ss', 'Gerald Baldric', 'gerald123@gmail.com', 'user'),
('parkerCar', 'NumBkwyWW8', 'Carley Parker', 'carley@gmail.com', 'user');

INSERT INTO posts (authorID, title, publishDate, content, status)
VALUES
(1, 'Hello', '2022-09-10', 'Whats up?', 1),
(2, 'Hello', '2022-09-10', 'I am a new here', 1),
(3, 'How to use it', '2022-09-12', 'What is the main idea of this community?', 1),
(4, 'C++ error', '2022-09-12', 'Can you explain this', 1),
(5, 'New admin', '2022-09-15', 'I need new admin for', 1);

INSERT INTO comments (authorID, postID, publishDate, content)
VALUES
(2, 1, '2022-09-12', 'Great'),
(3, 2, '2022-09-13', 'Me too'),
(1, 3, '2022-09-15', 'Sry cant help you'),
(5, 2, '2022-09-20', 'Hello, whats up?'),
(2, 4, '2022-09-21', 'Yep, it is pretty simple');

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
(1, 5),
(2, 5),
(3, 3),
(3, 5),
(4, 6),
(5, 1);

INSERT INTO postsLikes (authorID, postID, publishDate, type)
VALUES
(1, 2, '2022-09-12', 'like'),
(3, 1, '2022-09-12', 'like'),
(2, 1, '2022-09-12', 'like'),
(1, 3, '2022-09-12', 'like'),
(4, 4, '2022-09-20', 'like');

INSERT INTO commentsLikes (authorID, commentID, publishDate, type)
VALUES
(1, 2, '2022-09-22', 'like'),
(4, 2, '2022-09-23', 'like'),
(2, 3, '2022-09-20', 'like'),
(5, 5, '2022-09-22', 'like'),
(3, 1, '2022-09-21', 'like');