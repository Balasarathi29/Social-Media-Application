const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getSuggestedUsers,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Specific routes first (before /:id)
router.get('/search', searchUsers);
router.get('/suggested', protect, getSuggestedUsers);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);

// Generic routes last
router.get('/:id', getUserProfile);
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  updateUserProfile
);

module.exports = router;
