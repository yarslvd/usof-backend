const jwt = require('jsonwebtoken');
require('dotenv').config();

function createAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.SECURE_TOKEN, { expiresIn: process.env.TOKEN_EXPIRES_IN});
    return accessToken;
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    
    if(token == null) return res.sendStatus(401);

    try {
        const user = jwt.verify(token, process.env.SECURE_TOKEN);
        req.user = user;
        next();
    }
    catch(err) {
        res.clearCookie("token");
        return res.redirect('/');
    }
}

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

module.exports = {createAccessToken, authenticateToken, parseJwt};