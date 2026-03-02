"use client";

import { useState, useCallback } from "react";
import { commentAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await commentAPI.getByPost(postId);
      setComments(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch comments");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(
    async (content) => {
      if (!user) return { success: false, error: "Please login to comment" };
      if (!content.trim())
        return { success: false, error: "Comment cannot be empty" };

      try {
        const { data } = await commentAPI.create(postId, { content });
        setComments((prev) => [data, ...prev]);
        return { success: true, data };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to add comment",
        };
      }
    },
    [postId, user],
  );

  const deleteComment = useCallback(async (commentId) => {
    try {
      await commentAPI.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete comment",
      };
    }
  }, []);

  return {
    comments,
    setComments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  };
}
