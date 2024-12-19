const bcrypt  = require('bcrypt');  
const path  = require('path')
const fs  = require('fs');
const jwt  = require('jsonwebtoken');


const pathToPrivateKey = path.join(__dirname, 'private.pem');
const privateKey = fs.readFileSync(pathToPrivateKey, 'utf8');



async function generatePassword  (password) {
    const salt = await  bcrypt.genSalt(10);
    const hash = await  bcrypt.hash(password, salt);
    return hash;
}

const comparePassword  = async (password, hash) => {
    return await    bcrypt.compare(password, hash);    
}


const issueToken  = (user) => {

    const id  = user.id;
    const payload ={
        sub: id ,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 24
    }
    const signToken  = jwt.sign(payload, privateKey, {
        algorithm: 'RS256'
    });


    return {
        token : "Bearer " + signToken,
        expires : '1d'
    }
}


module.exports = {
    generatePassword,
    comparePassword,
    issueToken
}