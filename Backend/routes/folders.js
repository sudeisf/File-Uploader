const router = require('express').Router();

const {
    createFolder,
    getFolders,
    getFolder,
    updateFolder,
    deleteFolder,
} = require('../controller/foldersController');


router.post(':folderId',createFolder)

router.get('/',getFolders)
router.get('/:folderId',getFolder)

router.put('/:folderId',updateFolder)
router.delete('/:folderId',deleteFolder)


module.exports = router;