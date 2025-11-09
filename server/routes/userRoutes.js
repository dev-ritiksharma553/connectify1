const express = require('express');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/multer');
const router = express.Router();

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/logout').get(userController.logout);
router.route('/profile/:id').get(isAuth,userController.getProfile);
router.route('/editprofile').post(isAuth,upload.single('profilePicture'),userController.editProfile);
router.route('/suggesteduser').get(isAuth,userController.suggesteduser);
router.route('/followunfollow/:id').post(isAuth,userController.followUnfollow);


module.exports = router;