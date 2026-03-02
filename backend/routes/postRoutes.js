const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostsByUser,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getFeed,
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Specific routes first
router.get('/', getPosts);
router.get('/feed', protect, getFeed);
router.get('/user/:userId', getPostsByUser);
router.post('/', protect, upload.single('image'), createPost);
router.put('/like/:id', protect, likePost);

// Generic routes last
router.get('/:id', getPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
