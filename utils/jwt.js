const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');

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
        res.redirect('/');
    }
}

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function uploadImage() {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'resources/profile_images');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

    return { storage, fileFilter };
}

module.exports = {createAccessToken, authenticateToken, parseJwt, uploadImage};