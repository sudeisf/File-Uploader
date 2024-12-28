const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const authRoute = require('./routes/auth');
const cors = require('cors');
const fileRoute = require("./routes/files");
const folderRoute = require("./routes/folders");
const shareRoute = require("./routes/share");

const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173',  // The origin you're allowing
  credentials: true,               // Allow credentials like cookies
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie',"application/json"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure:false,  // For development; set to true in production with HTTPS
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,  // Session lasts for 1 day
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,  // Remove expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
    }),
  })
);

// Passport middleware (after session)
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/files', fileRoute);
app.use('/api/folders', folderRoute);
app.use('/share', shareRoute);

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
