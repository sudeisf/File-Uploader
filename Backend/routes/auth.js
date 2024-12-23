const router = require('express').Router();
const { loginController, registerController} = require('../controller/authController');

router.post('/register', registerController);
router.post('/login', loginController);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;