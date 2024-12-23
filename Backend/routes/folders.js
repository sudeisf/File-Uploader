const router = require('express').Router();

const {
    createFolder,
    getFolders,
    getFolder,
    updateFolder,
    deleteFolder,
} = require('../controller/foldersController');


router.post('/', createFolder);
router.get('/', getFolders);
router.get('/:id', getFolder);
router.put('/:id', updateFolder);
router.delete('/:id', deleteFolder);


module.exports = router;