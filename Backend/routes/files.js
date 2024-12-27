const router = require('express').Router();
const multer = require('multer');
const passport = require('../config/passportConfig');
const uploaderController = require('../controller/uploadController');
const upload = multer({ dest: 'uploads/' });
const authenticateUser = require('../middleware/authenticator');

router.post(
    '/file',
    upload.single('file'),
    authenticateUser,
    passport.authenticate('jwt', { session: false }),
    uploaderController.uploadFile
);

router.get('/file/:fileId',
    passport.authenticate('jwt', { session: false }),
    uploaderController.getFile);

router.get('/test', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.send('Test route');
    }
);

module.exports = router;
