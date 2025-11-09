const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/multer')

router.route('/addpost').post(isAuth,upload.single('image'),postController.addPost);
router.route('/all').get(isAuth,postController.allPost);
router.route('/userallpost').get(isAuth,postController.allUserPost)
router.route('/likes/:id').post(isAuth , postController.likePost)
router.route('/comment/:id').post(isAuth , postController.addComment)
router.route('/:id/comment/all').get(isAuth , postController.getCommentsofPost)
router.route('/delete/:id').delete(isAuth , postController.deletePost)
router.route('/:id/bookmark').get(isAuth , postController.bookmarkPost)
module.exports = router;