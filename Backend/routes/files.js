const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const uploaderController = require('../controller/uploadController');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Define the route with authentication and file upload
router.post(
    '/files',
    upload.single('file'),
    uploaderController.uploadFile
);
router.get('/files', uploaderController.getFile);
module.exports = router;
