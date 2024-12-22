const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const express = require('express');
const router = express.Router();
const uploaderController = require('../controller/uploaderController');

router.post('/files',passport.authenticate('jwt', { session: false }),upload.single('file'), uploaderController.uploadFile);

module.exports = router;  