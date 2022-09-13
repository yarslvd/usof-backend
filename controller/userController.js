const UserClass = require('../models/User');
const jwt = require('jsonwebtoken');

const User = new UserClass('users');

exports.getAllUsers = async (req, res) => {
    const users = await User.getAllUsers();
    return res.send(users);
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findID(req.params.user_id);
        return res.send(user);
    }
    catch(err) {
        return res.status(404).send('Not found 404');
    }
}