const router = require('express').Router();
const multer = require('multer');
const passport = require('../config/passport');
const uploaderController = require('../controller/uploadController');
const upload = multer({ dest: 'uploads/' });

router.post(
    '/file',
    (req, res, next) => {
        console.log('Authorization Header:', req.headers.authorization);
         next();   
    }
    ,
    passport.authenticate('jwt', { session: true }),
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
