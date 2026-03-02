const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add comment to post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { content } = req.body;

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'username profileImage'
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (owner only)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (owner only)
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const { content } = req.body;

    if (content) {
      comment.content = content;
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      'author',
      'username profileImage'
    );

    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  updateComment,
};
