const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const path = require('path');
const authRoute = require('./routes/auth');
const cors = require('cors');
const fileRoute = require("./routes/files")
const folderRoute = require("./routes/folders")
const shareRoute = require("./routes/share")

const prisma = new PrismaClient();


// Initialize Prisma client

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secret', // Secret for signing the session ID
    resave: false, // Prevent session being saved repeatedly
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session expiry (1 day)
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // Remove expired sessions every 2 minutes
      dbRecordIdIsSessionId: true, // Use session ID as the DB record ID
    }),
  })
);

app.use('/api/v1', authRoute);
app.use('/f', fileRoute);
app.use('/folders', folderRoute);
app.use('/share',shareRoute);



app.use(passport.initialize());
app.use(passport.session());



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
