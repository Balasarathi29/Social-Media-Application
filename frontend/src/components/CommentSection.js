"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { useComments } from "@/hooks/useComments";
import useAuthStore from "@/store/authStore";
import { formatDistanceToNow } from "@/lib/utils";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

export default function CommentSection({
  postId,
  onCommentAdded,
  onCommentDeleted,
}) {
  const user = useAuthStore((state) => state.user);
  const { comments, isLoading, fetchComments, addComment, deleteComment } =
    useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(newComment);
    if (result.success) {
      setNewComment("");
      if (onCommentAdded) onCommentAdded();
      toast.success("Comment added");
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    const result = await deleteComment(commentId);
    if (result.success) {
      if (onCommentDeleted) onCommentDeleted();
      toast.success("Comment deleted");
    } else {
      toast.error(result.error);
    }
  };

  const getAvatarUrl = (author) => {
    return (
      author?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.username || "User")}&background=0ea5e9&color=fff`
    );
  };

  return (
    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={getAvatarUrl(user)}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="input flex-1 py-2 text-sm"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="btn-primary px-3 py-2"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-sm text-slate-500">
          <Link href="/login" className="link">
            Login
          </Link>{" "}
          to comment
        </p>
      )}

      {/* Comments List */}
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Link
                href={`/profile/${comment.author?._id}`}
                className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src={getAvatarUrl(comment.author)}
                  alt={comment.author?.username || "User"}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/profile/${comment.author?._id}`}
                      className="text-sm font-semibold text-slate-900 hover:text-primary-500 dark:text-slate-100"
                    >
                      {comment.author?.username}
                    </Link>
                    {user?._id === comment.author?._id && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-700"
                      >
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {comment.content}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDistanceToNow(comment.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-slate-500">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
}
