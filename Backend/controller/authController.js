const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const uitls = require('../utils/utils')

const loginController = async (req, res) => {

    try{
        const user = await prisma.user.findUnique({
            where: {username: req.body.username}
        });
        if(!user){
            return res.status(401).send({message: 'User not found'});
        }
        const isValid = await uitls.comparePassword(req.body.password, user.password);
        if(!isValid){
            return res.status(401).send({message: 'Invalid password'});
        }
        const token = await uitls.issueToken(user);
        res.cookie("connect.sid", token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
        });
        return res.status(200).send({token: token , success: true});
    }catch(e){
        return res.status(500).send({message: e.message});
    }
}


const registerController = async (req, res) => {   
    try{
        const hash = await uitls.generatePassword(req.body.password);
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hash,
                email: req.body.email
            }
        });
        const token = uitls.issueToken(user);
        res.cookie("connect.sid", token, {
            httpOnly: true, // Prevent access to the cookie from JavaScript
            secure: true, // Ensure cookies are sent over HTTPS in production
            sameSite: "strict", // CSRF protection
            maxAge: 24 * 60 * 60 * 1000, 
          })
        return res.status(200).send({success: true,token: token});
    } catch(e){
        return res.status(500).send({message: e.message});
    }
}


module.exports = {
    loginController,
    registerController
}
