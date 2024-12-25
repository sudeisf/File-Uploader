const stratagy  = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');





const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
}

const prisma = new PrismaClient();


passport.use(
    new stratagy(
        option, async (payload, done) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: payload.id
                }
            })
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }
    )
)

module.exports = passport;