const bctypt  = require('bcrypt');  
const path  = require('path')
const fs  = require('fs');
const jwt  = require('jsonwebtoken');


const pathToPrivateKey = path.join(__dirname,'utils','private.pem');
const privateKey = fs.readFileSync(pathToPrivateKey, 'utf8');



const generatePassword  = async (password) => {
    const salt = await bctypt.genSalt(10);
    const hash = await bctypt.hash(password, salt);
    return hash;
}

const comparePassword  = async (password, hash) => {
    return await bctypt.compare(password, hash);    
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


module.eports = {
    generatePassword,
    comparePassword,
    issueToken
}