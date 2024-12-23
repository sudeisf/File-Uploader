const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const uploaderController = require('../controller/uploadController');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Define the route with authentication and file upload
router.post(
    '/files',
    passport.authenticate('jwt', { session: false }),
    upload.single('file'),
    uploaderController.uploadFile
);
router.get('/files', uploaderController.getFiles);
module.exports = router;
