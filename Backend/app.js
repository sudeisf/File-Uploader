const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const path = require('path');
const authRoute = require('./routes/auth');
const cors = require('cors');
const fileRoute = require("./routes/files");
const folderRoute = require("./routes/folders");
const shareRoute = require("./routes/share");
const cookieParser = require('cookie-parser');

const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173', // MUST be the exact origin
  credentials: true, // MUST be true
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Include 'Cookie'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] // Include OPTIONS
}));

app.use(cookieParser()); // Parse cookies BEFORE session
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Session middleware (must be after cookieParser and body parsers)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret', // Use environment variable
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Use environment variable
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            sameSite: 'strict', // recommended for security
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
app.use('/api/auth', authRoute);
app.use('/api/files', fileRoute);
app.use('/folders', folderRoute);
app.use('/share', shareRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});