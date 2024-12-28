const router = require('express').Router();
const authenticateUser = require('../middleware/authenticator');

const {
    createFolder,
    getFolders,
    getFolder,
    updateFolder,
    deleteFolder,
} = require('../controller/foldersController');


router.post('/create-folder',
    authenticateUser,
    createFolder);

router.get('/', 
    authenticateUser,
    getFolders);

router.get('/:id', 
    authenticateUser,
    getFolder);

router.put('/:id', 
    authenticateUser,
    updateFolder);

router.delete('/:id',
     authenticateUser,
     deleteFolder);


module.exports = router;