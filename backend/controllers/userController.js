const User = require('../models/User');
const Post = require('../models/Post');

const getUploadedFileUrl = (req, file) => {
  if (!file) return '';
  if (file.path && file.path.startsWith('http')) return file.path;
  if (file.filename) return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  return file.path || '';
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get posts count
    const postsCount = await Post.countDocuments({ author: user._id });

    res.json({
      ...user.toJSON(),
      postsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, bio } = req.body;

    // Check if username is taken (if changing)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    // Handle profile image upload (file)
    const profileImageFile = req.files?.profileImage?.[0];
    if (profileImageFile) {
      user.profileImage = getUploadedFileUrl(req, profileImageFile);
    }

    // Handle profile image from body (URL)
    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage;
    }

    // Handle cover image upload (file)
    const coverImageFile = req.files?.coverImage?.[0];
    if (coverImageFile) {
      user.coverImage = getUploadedFileUrl(req, coverImageFile);
    }

    // Handle cover image from body (URL)
    if (req.body.coverImage !== undefined) {
      user.coverImage = req.body.coverImage;
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    const postsCount = await Post.countDocuments({ author: user._id });

    res.json({
      ...updatedUser.toJSON(),
      postsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow user
// @route   PUT /api/users/follow/:id
// @access  Private
const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-follow
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Add to following/followers
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user._id },
    });

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow user
// @route   PUT /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-unfollow
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Remove from following/followers
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users
// @route   GET /api/users/suggested
// @access  Private
const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Get users not followed by current user (excluding self)
    const suggestedUsers = await User.find({
      _id: { $nin: [...currentUser.following, req.user._id] },
    })
      .select('username profileImage bio')
      .limit(5);

    res.json(suggestedUsers);
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
    })
      .select('username profileImage bio')
      .limit(10);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getSuggestedUsers,
  searchUsers,
};
