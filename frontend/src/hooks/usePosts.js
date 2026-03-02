"use client";

import { useState, useEffect, useCallback } from "react";
import { postAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";

export function usePosts(type = "all", initialPage = 1) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } =
          type === "feed"
            ? await postAPI.getFeed(pageNum)
            : await postAPI.getAll(pageNum);

        if (append) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setHasMore(pageNum < data.pages);
        setPage(pageNum);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    },
    [type],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(page + 1, true);
    }
  }, [fetchPosts, isLoading, hasMore, page]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchPosts(1, false);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(initialPage);
  }, [fetchPosts, initialPage]);

  return { posts, setPosts, isLoading, error, hasMore, loadMore, refresh };
}

export function useUserPosts(userId, initialPage = 1) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      if (!userId) return;
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await postAPI.getByUser(userId, pageNum);
        if (append) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setHasMore(pageNum < data.pages);
        setPage(pageNum);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(page + 1, true);
    }
  }, [fetchPosts, isLoading, hasMore, page]);

  const refresh = useCallback(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(initialPage);
  }, [fetchPosts, initialPage, userId]);

  return { posts, setPosts, isLoading, error, hasMore, loadMore, refresh };
}

export function useLikePost() {
  const user = useAuthStore((state) => state.user);
  const [isLiking, setIsLiking] = useState(false);

  const likePost = useCallback(
    async (postId, currentLikes, onSuccess) => {
      if (!user) return { success: false, error: "Please login to like posts" };

      setIsLiking(true);
      try {
        const { data } = await postAPI.like(postId);
        if (onSuccess) {
          onSuccess(data);
        }
        return { success: true, data };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to like post",
        };
      } finally {
        setIsLiking(false);
      }
    },
    [user],
  );

  const isLiked = useCallback(
    (likes) => {
      if (!user) return false;
      return likes?.some((like) => like === user._id || like._id === user._id);
    },
    [user],
  );

  return { likePost, isLiked, isLiking };
}
