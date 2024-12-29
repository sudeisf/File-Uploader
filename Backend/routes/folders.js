const router = require('express').Router();
const authenticateUser = require('../middleware/authenticator');

const {
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder,
} = require('../controller/foldersController');


router.post('/create-folder',
    authenticateUser,
    createFolder);

router.get('/folder-list', 
    authenticateUser,
    getFolders);

router.put('/:id', 
    authenticateUser,
    updateFolder);

router.delete('/:id',
     authenticateUser,
     deleteFolder);


module.exports = router;