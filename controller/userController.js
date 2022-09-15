const UserClass = require('../models/User');
const { parseJwt } = require('../utils/jwt');
const { passStrengthChecker, validateUsername }= require('../utils/registerErrorHandler');
const bcrypt = require('bcrypt');

const User = new UserClass('users');

exports.getAllUsers = async (req, res) => {
    let obj = parseJwt(req.cookies.token);
    if(obj.role === 'admin') {
        try {
            const users = await User.getAllUsers();
            return res.send(users);
        }
        catch(err) {
            return res.send('Some error happened');
        }
    }
    else {
        return res.send('You have no access');
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findID(req.params.user_id);
        return res.send(user);
    }
    catch(err) {
        return res.sendStatus(404);
    }
}

exports.createUser = async (req, res) => {
    let obj = parseJwt(req.cookies.token);
    if(obj.role === 'admin') {
        let exists = await User.exists(req.body);
        if(exists) {
            return res.json({message:'User is already exists!'});
        }

        try {
            handleErrors(req.body);
        }
        catch(err) {
            return res.json({message:err});
        }

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        let obj = {
            login: req.body.login,
            password: req.body.password,
            email: req.body.email,
            fullname: req.body.fullname,
            role: req.body.role
        }

        try {
            await User.create(obj);
            res.json( {message: 'User created successfully'} );
        }
        catch(err) {
            res.json( {message: 'Error while creating user'} );
        }
    }
    else {
        return res.send('You have no access');
    }
}

exports.updateUserData = async (req, res) => {
    let obj = parseJwt(req.cookies.token);
    if(req.params.user_id == obj.id || obj.role == 'admin') {
        const user = await User.findID(req.params.user_id);
        if(req.body.password && req.body.passwordRepeat) {
            if(passStrengthChecker(req.body.password)) {
                return res.send('Password is not strong enough');
            }

            const salt = await bcrypt.genSalt(10);
            let encryptedPassword = await bcrypt.hash(req.body.password, salt);

            try {
                await User.updatePassword(user.email, encryptedPassword);
            }
            catch(err) {
                console.log(err);
                return res.json({ message: 'Some error has occured' });
            }
        }
        if(req.body.fullname) {
            if(validateUsername(req.body.fullname)) {
                return res.send('Please enter your full name');
            }

            try {
                await User.updateInfo(user.email, 'fullname', req.body.fullname);
            }
            catch(err) {
                console.log(err);
                return res.json({ message: 'Some error has occured' });
            }
        }
        if(req.body.login) {
            try {
                await User.updateInfo(user.email, 'login', req.body.login);
            }
            catch(err) {
                console.log(err);
                return res.json({ message: 'This login is already taken' });
            }
        }

        return res.send('Information was successfully updated');
    }
    else {
        return res.send('You have no access to update this information');
    }
}

exports.deleteUser = async (req, res) => {
    let obj = parseJwt(req.cookies.token);
    if(req.params.user_id == obj.id || obj.role == 'admin') {
        try {
            await User.deleteUser(req.params.user_id);
            return res.send('User has been successfully deleted');
        }
        catch(err) {
            return res.send('There is no user with such id');
        }
    }
    else {
        return res.send('You have no access to delete this user');
    }
}