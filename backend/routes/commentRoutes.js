const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment,
  updateComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

router.get("/:postId", getComments);
router.post("/:postId", protect, addComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
