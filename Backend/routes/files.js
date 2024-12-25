const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const uploaderController = require('../controller/uploadController');
const upload = multer({ dest: 'uploads/' });

router.post(
    '/files',
    upload.single('file'),
    uploaderController.uploadFile
);
router.get('/files',
    passport.authenticate('jwt', { session: false }),uploaderController.getFile);
module.exports = router;
