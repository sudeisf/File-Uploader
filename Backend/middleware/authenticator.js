const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie');

const pathToPrivateKey = path.join(__dirname, '../utils', 'private.pem');
const SECRET_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

const authenticateUser = async (req, res, next) => {
    const cookie = req.headers.cookie;
    const cookies = cookieParser.parse(cookie);
    const token = cookies['token'];

    let jsonString = token.replace(/^j:/, '');
    let cookieJson = JSON.parse(jsonString);
    let tokenFromCookie = cookieJson['token'];

    if (!tokenFromCookie) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const tokenBody = tokenFromCookie.split(' ')[1];

    // Verify the JWT
    jwt.verify(tokenBody, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        console.log(req.user); // Attach user to the request
        next();
    });

}

module.exports = authenticateUser;
