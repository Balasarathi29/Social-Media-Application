const Post = require("../models/Post");
const Comment = require("../models/Comment");

const getUploadedFileUrl = (req, file) => {
  if (!file) return "";
  if (file.path && file.path.startsWith("http")) return file.path;
  if (file.filename)
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  return file.path || "";
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    const postData = {
      author: req.user._id,
      content,
    };

    // Handle uploaded file (image or video)
    if (req.file) {
      postData.image = getUploadedFileUrl(req, req.file);
      postData.mediaType = req.file.mimetype.startsWith("video/")
        ? "video"
        : "image";
    } else if (req.body.image) {
      // Handle URL (image or video)
      postData.image = req.body.image;
      const extension = req.body.image.split(".").pop().toLowerCase();
      postData.mediaType = ["mp4", "webm", "ogg", "mov"].includes(extension)
        ? "video"
        : "image";
    }

    const post = await Post.create(postData);

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username profileImage",
        },
      });

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (global feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get comments count for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toJSON(),
          commentsCount,
        };
      }),
    );

    const total = await Post.countDocuments();

    res.json({
      posts: postsWithComments,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toJSON(),
          commentsCount,
        };
      }),
    );

    const total = await Post.countDocuments({ author: req.params.userId });

    res.json({
      posts: postsWithComments,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username profileImage",
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: post._id })
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 });

    res.json({
      ...post.toJSON(),
      comments,
      commentsCount: comments.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (owner only)
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const { content } = req.body;

    if (content) {
      post.content = content;
    }

    // Handle image upload
    if (req.file) {
      post.image = getUploadedFileUrl(req, req.file);
    }

    // Handle image from body (URL)
    if (req.body.image !== undefined) {
      post.image = req.body.image;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username profileImage",
    );

    const commentsCount = await Comment.countDocuments({ post: post._id });

    res.json({
      ...updatedPost.toJSON(),
      commentsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (owner only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();
    const isLiked = post.likes.some((like) => like.toString() === userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username profileImage",
    );

    const commentsCount = await Comment.countDocuments({ post: post._id });

    res.json({
      ...updatedPost.toJSON(),
      commentsCount,
      isLiked: !isLiked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feed (posts from followed users)
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const followingIds = req.user.following
      ? req.user.following.map((id) => id.toString())
      : [];
    const authorIds = [...followingIds, req.user._id];

    // Get posts from users the current user follows + own posts
    const posts = await Post.find({
      author: { $in: authorIds },
    })
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toJSON(),
          commentsCount,
        };
      }),
    );

    const total = await Post.countDocuments({
      author: { $in: authorIds },
    });

    res.json({
      posts: postsWithComments,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostsByUser,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getFeed,
};
