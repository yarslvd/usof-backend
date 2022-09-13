const UserClass = require('../models/User');
const { createAccessToken, parseJwt } = require('../utils/jwt');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const handleErrors = require('../utils/registerErrorHandler');
require('dotenv').config();

const User = new UserClass('users');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD
    }
});

exports.register = async (req, res) => {
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
        fullname: req.body.fullname
    }

    //creating confirm token
    const token = jwt.sign({obj: obj},
        process.env.SECURE_TOKEN, {expiresIn: '5m'});
    const link = `http://localhost:3000/api/auth/confirm/${token}`

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
            await User.create(obj);
            return res.json({ message: 'Email confirmed' });
        }
        catch(err) {
            return res.json({ message: 'Some error has occured' });
        }
    }
    catch(err) {
        res.send('This verification link is no longer reachable');
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.find(req.body.login);

        const passCheck = await bcrypt.compare(req.body.password, user.password);
        if(!passCheck) {
            return res.json( {message: 'Login or password is incorrect'} );
        }

        //creating token andw writting it in cookies
        const token = createAccessToken({login: user.login, id: user.id});
        res.cookie('token', token);

        res.redirect('/');
    }
    catch(err) {
        return res.json( {message: 'There is no user with such login'} );
    }
}

exports.passwordReset = async (req, res) => {
    let user = await User.findEmail(req.body.email);
    if(user === 0) {
        return res.json('There is no account associated with this email');
    }

    //creating confirm token
    const token = jwt.sign({email: user.email, id: user.id},
        process.env.SECURE_TOKEN, {expiresIn: '5m'});
    console.log(token);

    const link = `http://localhost:3000/api/auth/password-reset/${token}`
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
            return res.json({ message: 'Passwords are different' });
        }

        try {
            const salt = await bcrypt.genSalt(10);
            let encryptedPassword = await bcrypt.hash(password, salt);
            await User.updatePassword(parseJwt(token).email, encryptedPassword);
            return res.json({ message: 'Password has been successfully updated'} );
        }
        catch(err) {
            console.log(err);
            return res.json({ message: 'Some error has occured' });
        }
    }
    catch(err) {
        return res.send('User is not verified');
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

