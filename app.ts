const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const sessionStore = require('connect-prisma-session')(session);
const prisma = require('./prisma/prisma');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    },
    store: new sessionStore({
        prisma,
        tableName: 'sessions',
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 
        }
    })
}))


app.use(passport.initialize());
app.use(passport.session());




app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 