const { users } = require('../utils/initTables');
const UserClass = require('../models/UserSeq');
const { passStrengthChecker, validateUsername, validateEmail } = require('../utils/registerErrorHandler');
const Op = require('Sequelize').Op
const bcrypt = require('bcrypt');

const User = new UserClass('users');

exports.getAllUsers = async (req, res) => {
    if(req.user.role === 'admin') {
        try {
            const result = await User.findAll(users);
            return res.json(result);
        }
        catch(err) {
            return res.send('Some error happened');
        }
    }
    else {
        return res.send('You have no permission to view all users');
    }
}

exports.getUser = async (req, res) => {
    try {
        const result = await User.findOne(users, { where: { id: +req.params.user_id } });
        if(result === null) {
            return res.send('User is not found');
        }
        return res.json(result);
    }
    catch(err) {
        return res.send('Some error occured');
    }
}

exports.createUser = async (req, res) => {
    if(req.user.role === 'admin') {
        try {
            let exists = await User.findOne(users, { where: { [Op.or]: [{login: req.body.login}, {email: req.body.email}] } });
            if(exists) {
                return res.send('User is already exists!');
            }
        }
        catch(err) {
            console.error(err);
            return res.send('Some error have occured');
        }

        if(req.body.password !== req.body.passwordRepeat) {
            return res.send('Passwords are different');
        }
        if(passStrengthChecker(req.body.password)) {
            return res.send('Password is not strong enough');
        }
        if(validateUsername(req.body.fullname)) {
            return res.send('Please enter your full name');
        }
        if(validateEmail(req.body.email)) {
            return res.send('Email is not valid');
        }

        const salt = await bcrypt.genSalt(12);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        let obj = {
            login: req.body.login,
            password: req.body.password,
            email: req.body.email,
            fullname: req.body.fullname,
            role: req.body.role
        }

        try {
            await User.create(users, obj);
            res.send('User created successfully');
        }
        catch(err) {
            res.send('Error while creating user');
        }
    }
    else {
        return res.send('You have no permission to create new user');
    }
}

exports.updateUserData = async (req, res) => {
    if(+req.params.user_id === req.user.id || req.user.role === 'admin') {
        try {
            let exists = await User.findOne(users, { where: { id: +req.params.user_id } });
            if(!exists) {
                return res.send('User have not found');
            }
        }
        catch(err) {
            console.error(err);
            return res.send('Some error have occured');
        }

        if(req.body.password && req.body.passwordRepeat && req.body.password === req.body.passwordRepeat) {
            if(passStrengthChecker(req.body.password)) {
                return res.send('Password is not strong enough');
            }

            const salt = await bcrypt.genSalt(12);
            let encryptedPassword = await bcrypt.hash(req.body.password, salt);

            try {
                await User.update(users, { password: encryptedPassword }, { where: { id: +req.params.user_id } });
            }
            catch(err) {
                console.error(err);
                return res.send('Some error has occured');
            }
        }
        if(req.body.fullname) {
            if(validateUsername(req.body.fullname)) {
                return res.send('Please enter your full name');
            }

            try {
                await User.update(users, { fullname: req.body.fullname }, { where: { id: +req.params.user_id } });
            }
            catch(err) {
                console.error(err);
                return res.send('Some error has occured');
            }
        }
        if(req.body.login) {
            try {
                await User.update(users, { login: req.body.login }, { where: { id: +req.params.user_id } });
            }
            catch(err) {
                console.error(err);
                return res.send('This login is already taken');
            }
        }
        return res.send('Information was successfully updated');
    }
    else {
        return res.send('You have no access to update this information');
    }
}

exports.deleteUser = async (req, res) => {
    console.log(+req.params.user_id === req.user.id);
    if(+req.params.user_id === req.user.id || req.user.role === 'admin') {
        try {
            let result = await User.delete(users, { where: { id: +req.params.user_id } });
            if(result === null) {
                return res.send('User is not found');
            }
            return res.send('User has been successfully deleted');
        }
        catch(err) {
            return res.send('Some error has occured');
        }
    }
    else {
        return res.send('You have no access to delete this user');
    }
}