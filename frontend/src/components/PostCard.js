"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHeart,
  FiMessageCircle,
  FiTrash2,
  FiEdit2,
  FiMoreHorizontal,
  FiX,
} from "react-icons/fi";
import { formatDistanceToNow } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { useLikePost } from "@/hooks/usePosts";
import CommentSection from "./CommentSection";
import toast from "react-hot-toast";
import { postAPI } from "@/lib/api";

export default function PostCard({ post, onDelete, onUpdate }) {
  const user = useAuthStore((state) => state.user);
  const { likePost, isLiked, isLiking } = useLikePost();
  const [currentPost, setCurrentPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const isOwner = user?._id === currentPost.author?._id;
  const liked = isLiked(currentPost.likes);

  const getMediaType = (post) => {
    if (post.mediaType) return post.mediaType;
    if (post.image && /\.(mp4|webm|ogg|mov)$/i.test(post.image)) return "video";
    return "image";
  };
  const mediaType = getMediaType(currentPost);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }
    const result = await likePost(
      currentPost._id,
      currentPost.likes,
      (data) => {
        setCurrentPost((prev) => ({
          ...prev,
          likes: data.likes,
          likesCount: data.likesCount,
        }));
      },
    );
    if (!result.success) {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      await postAPI.delete(currentPost._id);
      toast.success("Post deleted successfully");
      if (onDelete) {
        onDelete(currentPost._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
    }
  };

  const getAvatarUrl = (author) => {
    return (
      author?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.username || "User")}&background=0ea5e9&color=fff`
    );
  };

  return (
    <article className="card group">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <Link
          href={`/profile/${currentPost.author?._id}`}
          className="flex items-center gap-3"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-700">
            <Image
              src={getAvatarUrl(currentPost.author)}
              alt={currentPost.author?.username || "User"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900 hover:text-primary-500 dark:text-slate-100">
              {currentPost.author?.username}
            </p>
            <p className="text-sm text-slate-500">
              {formatDistanceToNow(currentPost.createdAt)}
            </p>
          </div>
        </Link>

        {/* Options Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`rounded-full p-2 transition-colors ${
                showOptions
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              <FiMoreHorizontal className="h-5 w-5" />
            </button>

            {/* Backdrop to close menu when clicking outside */}
            {showOptions && (
              <div
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setShowOptions(false)}
              />
            )}

            {showOptions && (
              <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-1">
                  <Link
                    href={`/edit-post/${currentPost._id}`}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100 transition-colors"
                    onClick={() => setShowOptions(false)}
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Edit Post
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mt-4">
        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
          {currentPost.content}
        </p>

        {/* Media Display */}
        {currentPost.image && (
          <div className="relative mt-4 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
            {mediaType === "video" ? (
              <video
                src={currentPost.image}
                controls
                className="max-h-[500px] w-full object-contain"
              />
            ) : (
              <div
                className="cursor-pointer relative aspect-video"
                onClick={() => setShowImageModal(true)}
              >
                <Image
                  src={currentPost.image}
                  alt="Post content"
                  fill
                  className="object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && mediaType === "image" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200"
          onClick={() => setShowImageModal(false)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowImageModal(false)}
          >
            <FiX className="h-6 w-6" />
          </button>

          <div
            className="relative h-full w-full max-h-[90vh] max-w-7xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentPost.image}
              alt="Full view"
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
            liked
              ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-slate-500 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
          }`}
        >
          <FiHeart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          <span>
            {currentPost.likesCount || currentPost.likes?.length || 0}
          </span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-primary-500 dark:hover:bg-slate-700 transition-colors"
        >
          <FiMessageCircle className="h-5 w-5" />
          <span>{currentPost.commentsCount || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={currentPost._id}
          onCommentAdded={() => {
            setCurrentPost((prev) => ({
              ...prev,
              commentsCount: (prev.commentsCount || 0) + 1,
            }));
          }}
          onCommentDeleted={() => {
            setCurrentPost((prev) => ({
              ...prev,
              commentsCount: Math.max((prev.commentsCount || 1) - 1, 0),
            }));
          }}
        />
      )}
    </article>
  );
}
