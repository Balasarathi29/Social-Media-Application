"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { postAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await postAPI.getOne(params.id);

        // Check if user is the author
        if (user && data.author._id !== user._id) {
          toast.error("You can only edit your own posts");
          router.push("/feed");
          return;
        }

        setContent(data.content);
        setImageUrl(data.image || "");
      } catch (error) {
        toast.error("Failed to load post");
        router.push("/feed");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id && user) {
      fetchPost();
    }
  }, [params.id, router, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = { content, image: imageUrl };
      await postAPI.update(params.id, postData);
      toast.success("Post updated!");
      router.push("/feed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl">
        <div className="card">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Edit Post
          </h1>

          <form onSubmit={handleSubmit} className="mt-6">
            {/* Content Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="input resize-none"
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="mt-1 text-right text-sm text-slate-400">
              {content.length}/1000
            </div>

            {/* Image URL Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input"
                disabled={isSubmitting}
              />
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative mt-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setImageUrl("")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1 text-white hover:bg-slate-900"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="btn-primary"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Update Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
