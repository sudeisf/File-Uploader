
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const path = require('path');
const fs = require('fs');

const pathToPubKey = path.join(__dirname, '../utils', 'public.pem');
const publicKey = fs.readFileSync(pathToPubKey, 'utf8');



const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();





const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey,
  algorithms: ['RS256'],
};

passport.use(
  new JwtStrategy(
    opts,
    async (jwt_payload, done) => {
      try {
        console.log('Decoded JWT Payload:', jwt_payload);  // Log the whole payload for debugging

        // Check if the expected properties (like `sub`) are present
        if (!jwt_payload || !jwt_payload.sub) {
          console.error('JWT Payload is missing expected fields:', jwt_payload);
          return done(null, false);  // Reject if required fields are missing
        }

        const user = await prismaClient.user.findUnique({
          where: {
            id: jwt_payload.sub,  // Use `sub` field (or your specific field) from the payload
          },
        });

        if (user) {
          console.log('User found:', user);  // Debugging the found user
          return done(null, user);
        } else {
          console.log('User not found with ID:', jwt_payload.sub);
          return done(null, false);  // Reject if no user found
        }
      } catch (err) {
        console.error('Error during authentication:', err);
        return done(err, false);  // Handle any errors during the authentication process
      }
    }
  )
);


module.exports = passport;