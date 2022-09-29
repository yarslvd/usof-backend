# USOF API

API for question and answer service for professional and enthusiast programmers. The latter allows you to share your problems/solutions with short posts, receive solutions/feedback, or even increase your profile rating.

## Installation

1. Clone project:
```bash
git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-backend/ydoroshenk.git   # For campus users
git clone git@github.com:yarslvd/usof-backend.git   # Github repo
```
2. In the folder run ```npm install```
3. Go to the **database** folder and create a database with ```mysql -u root -p < db.sql```
4. Insert the test data into your database with ```mysql -u root -p < insert.sql```
5. Finally, run the server ```node index.js```

## Usage
**To use the API properly, please, create a new user. If you try to log in with test data, you will get an error, because of the non-hashed password. This data is provided just for the test of different endpoints.**

1. Creating the account
![alt text](https://i.imgur.com/q35eALw.png)