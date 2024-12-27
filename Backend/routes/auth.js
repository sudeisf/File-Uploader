const router = require('express').Router();
const { loginController, registerController} = require('../controller/authController');

router.post('/register', registerController);
router.post('/login', loginController);

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
    }); 
    req.clearCookie('jwt');
    res.status(200).send({success: true, message: 'Logout successful'});
});

module.exports = router;