const JwtStrategy = require('passport-jwt').Strategy; // Correct import
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// JWT Strategy options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
  secretOrKey: 'secret', // Use a secret key for verifying the token
};

// Register the JWT Strategy
passport.use(
  new JwtStrategy(
    options,
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: payload.id, // Assuming `payload.id` exists in your JWT
          },
        });

        if (user) {
          return done(null, user); // User is authenticated
        } else {
          return done(null, false); // No user found
        }
      } catch (error) {
        return done(error, false); // Handle any errors
      }
    }
  )
);

module.exports = passport;
