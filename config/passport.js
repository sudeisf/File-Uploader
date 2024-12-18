const passport  = require('passport');
const Stratagy  = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new Stratagy(options, (payload, done, done) => {
    return done(null, payload);
}));





module.exports = passport;