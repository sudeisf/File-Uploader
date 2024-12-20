const router = require('express').Router();
const { loginController, registerController} = require('../controller/authController');






router.get('/register', registerController);
router.get('/login', loginController);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;