
const Stratagy  = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { PrismaClient }  = require('@prisma/client');
const prismaClient  = new PrismaClient();


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new Stratagy(options,async (payload, done, done) => {
    try{
        const user  = await prismaClient.user.findUnique({
            where: {id: payload.sub}
        });
        if(!user){ 
            return done(null, false, {message : 'User not found'});
        }
        return done(null, user);
    }catch(e){
        return done(e, false)
    }

}));

module.exports = passport;