//const UserClass = require('../models/User');
const { createAccessToken, parseJwt } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { handleErrors } = require('../utils/registerErrorHandler');
const Op = require('Sequelize').Op
const { users } = require('../utils/initTables');
const UserClass = require('../models/UserSeq');
require('dotenv').config();

const User = new UserClass();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD
    }
});

exports.register = async (req, res) => {
    //Check if the user exists
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

    //Handling basic errors
    try {
        handleErrors(req.body);
    }
    catch(err) {
        return res.json({message:err});
    }

    //Hashing password
    const salt = await bcrypt.genSalt(12);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    let obj = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        fullname: req.body.fullname
    }

    //Creating confirm token
    const token = jwt.sign({obj: obj},
        process.env.SECURE_TOKEN, {expiresIn: '5m'});
    const link = `http://localhost:3000/api/auth/confirm/${token}`

    //Sending message to the mail to confirm
    let message = {
        from: `ydoroshenk <${process.env.MAIL}>`,
        to: req.body.email,
        subject: 'Email Confirmation',
        html: `
            <p>We just need one small favor from you - please confirm your email to continue.</p><br><br>
            <a href='${link}' target='_blank' style='outline:none; background-color:#118ac2; font-size: 16px; color: #fff;
            border: none; padding: 10px 40px; border-radius: 25px; margin: 10px 0;'>Confirm</a><br><br>
            <b>yarslvd</b>
            `
    };
    transporter.sendMail(message, (error, info) => {
        if (error) {
          return res.json({ error: error });
        } else {
          return res.json({ message: 'Email sent: ' + info.response });
        }
    });

    res.clearCookie('token');
}

exports.confirmEmail = async (req, res) => {
    const { token } = req.params;

    try {
        jwt.verify(token, process.env.SECURE_TOKEN);
        try {
            let obj = parseJwt(token).obj;
            await User.create(users, obj);
            return res.send('Email confirmed');
        }
        catch(err) {
            console.error(err);
            return res.json('Some error has occured');
        }
    }
    catch(err) {
        return res.send('This verification link is no longer reachable');
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne(users, { where: { login: req.body.login } });

        //Check if the password is correct
        const passCheck = await bcrypt.compare(req.body.password, user.password);
        if(!passCheck) {
            return res.send('Login or password is incorrect');
        }

        //Creating token and writting it in cookies
        const token = createAccessToken({login: user.login, id: user.id, role: user.role});
        res.cookie('token', token);

        return res.send('Successfully logged in');
    }
    catch(err) {
        return res.send('There is no user with such login');
    }
}

exports.passwordReset = async (req, res) => {
    let user = await User.findOne(users, { where: { email: req.body.email } });
    if(user === null) {
        return res.send('There is no account associated with this email');
    }

    //Creating confirm token
    const token = jwt.sign({email: user.email, id: user.id},
        process.env.SECURE_TOKEN, {expiresIn: '5m'});
    const link = `http://localhost:3000/api/auth/password-reset/${token}`

    //Sending the message with link
    let message = {
        from: `ydoroshenk <${process.env.MAIL}>`,
        to: user.email,
        subject: 'Password Reset',
        html: `
            <h5>Hello, ${user.login}</h5>
            <p>We have received a request to reset the password for your account. No changes have been made
            for your account yet.</p>
            <b>You can reset your password by clicking the link below:</b><br><br>
            <a href='${link}' target='_blank' style='outline:none; background-color:#118ac2; font-size: 16px; color: #fff;
            border: none; padding: 10px 40px; border-radius: 25px; margin: 10px 0;'>Reset password</a><br><br>
            <p>If you did not request a new password, ignore this message.</p>
            <b>yarslvd</b>
            `
    };
    transporter.sendMail(message, (error, info) => {
        if (error) {
          return res.json({ error: error });
        } else {
          return res.json({ message: 'Email sent: ' + info.response });
        }
    });
}

exports.confirmPasswordReset = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        jwt.verify(token, process.env.SECURE_TOKEN);
        if(password != confirmPassword) {
            return res.send('Passwords are different');
        }

        try {
            const salt = await bcrypt.genSalt(12);
            let encryptedPassword = await bcrypt.hash(password, salt);
            await User.update(users, { password: encryptedPassword }, { where: { email: parseJwt(token).email} });
            return res.send('Password has been successfully updated');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error has occured');
        }
    }
    catch(err) {
        return res.send('This link is no longer reachable');
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
}

exports.signUpPage = (req, res) => {
    res.sendFile(path.resolve('views', 'signup.html'));
}

exports.loginPage = (req, res) => {
    res.sendFile(path.resolve('views', 'login.html'));
}

exports.homePage = (req, res) => {
    res.sendFile(path.resolve('views', 'home.html'));
}

