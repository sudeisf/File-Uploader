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



app.use(express.json()); // Parse incoming JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Initialize CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Session middleware (must be before passport)
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // Remove expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
    }),
  })
);

// Passport middleware (after session)
app.use(passport.initialize());
app.use(passport.session());

// Routes (after all middleware is applied)
app.use('/api/v1', authRoute);
app.use('/f', fileRoute);
app.use('/folders', folderRoute);
app.use('/share', shareRoute);



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
