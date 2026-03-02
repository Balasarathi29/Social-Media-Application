"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiImage, FiX, FiLink } from "react-icons/fi";
import { postAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function CreatePostPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    setImagePreview(url);
    const extension = url.split(".").pop().toLowerCase();
    setMediaType(
      ["mp4", "webm", "ogg", "mov"].includes(extension) ? "video" : "image",
    );
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImageUrl("");
    setImagePreview(previewUrl);
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
    setShowUrlInput(false);
  };

  const removeImage = () => {
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = new FormData();
      postData.append("content", content);

      if (imageFile) {
        postData.append("image", imageFile);
      } else if (imageUrl) {
        postData.append("image", imageUrl);
      }

      await postAPI.create(postData);
      toast.success("Post created!");
      router.push("/feed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarUrl = () => {
    return (
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=0ea5e9&color=fff`
    );
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl">
        <div className="card">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Create Post
          </h1>

          <form onSubmit={handleSubmit} className="mt-6">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={getAvatarUrl()}
                  alt={user?.username || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {user?.username}
              </span>
            </div>

            {/* Content Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="input mt-4 resize-none border-none shadow-none focus:ring-0"
              disabled={isSubmitting}
              maxLength={1000}
            />

            {/* Preview (Image or Video) */}
            {imagePreview && (
              <div className="relative mb-4 mt-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {mediaType === "video" ? (
                    <video
                      src={imagePreview}
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      onError={() => {
                        setImagePreview("");
                        toast.error("Invalid media URL");
                      }}
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white transition-colors hover:bg-slate-900"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost rounded-full p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  title="Upload image or video"
                >
                  <FiImage className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                {/* URL Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className={`btn-ghost rounded-full p-2 transition-colors ${
                    showUrlInput
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      : "text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  }`}
                  title="Add media URL"
                >
                  <FiLink className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">
                  {content.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="btn-primary rounded-full px-6"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Post"}
                </button>
              </div>
            </div>

            {/* URL Input Area (Collapsible) */}
            {showUrlInput && (
              <div className="fade-in animate-in slide-in-from-top-2 mt-3 duration-200">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Paste image or video link here..."
                  className="input w-full bg-slate-50 text-sm dark:bg-slate-900/50"
                  autoFocus
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
