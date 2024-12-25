const router = require('express').Router();
const multer = require('multer');
const passport = require('../config/passportConfig');
const uploaderController = require('../controller/uploadController');
const upload = multer({ dest: 'uploads/' });

router.post(
    '/file',
    passport.authenticate('jwt', { session: false }),  // JWT authentication middleware
    (req, res, next) => {
        if (req.user) {
            console.log('JWT Payload:', req.user);  // Log the payload (user data)
        } else {
            console.log('No user found in token payload');
        }
        next();  // Move to the next middleware if user is found
    },
    upload.single('file'),
    uploaderController.uploadFile
);

router.get('/file',
    passport.authenticate('jwt', { session: false }),
    uploaderController.getFile);

router.get('/test', 
passport.authenticate('jwt', { session: false }),
    (req, res) => {
    res.send('Test route');
});

module.exports = router;
