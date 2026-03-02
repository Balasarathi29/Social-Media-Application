"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import useAuthStore from "@/store/authStore";
import PostCard from "@/components/PostCard";
import { PostSkeletonList } from "@/components/PostSkeleton";
import SuggestedUsers from "@/components/SuggestedUsers";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiImage, FiVideo } from "react-icons/fi";

export default function FeedPage() {
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const { posts, setPosts, isLoading, error, hasMore, loadMore, refresh } =
    usePosts(activeTab);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchUser();
    }
    if (token) {
      setActiveTab("feed");
    } else {
      setActiveTab("all");
    }
  }, [fetchUser, user]);

  // Infinite scroll observer
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, loadMore]);

  const handleDeletePost = useCallback(
    (postId) => {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    },
    [setPosts],
  );

  const getAvatarUrl = (user) => {
    return (
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=0ea5e9&color=fff`
    );
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Main Feed */}
      <div className="flex-1">
        {isAuthenticated && (
          <div className="bg-white/90 backdrop-blur-md sticky top-16 z-10 -mx-4 mb-6 flex overflow-x-auto border-b border-slate-200 px-4 scrollbar-hide dark:bg-slate-900/90 dark:border-slate-800 sm:mx-0 sm:rounded-xl sm:border sm:px-2 sm:pt-2">
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "feed"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Explore
            </button>
          </div>
        )}

        {/* Create Post Prompt */}
        {isAuthenticated && (
          <div className="card mb-6 overflow-hidden p-4">
            <div className="flex gap-4">
              <Link href={`/profile/${user?._id}`} className="shrink-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-700">
                  <Image
                    src={getAvatarUrl(user)}
                    alt={user?.username || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <Link href="/create-post" className="flex-1">
                <div className="h-10 w-full cursor-pointer rounded-full bg-slate-100 px-4 py-2.5 text-left text-sm text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors">
                  What's on your mind, {user?.username}?
                </div>
              </Link>
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex gap-2">
                <Link
                  href="/create-post"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <FiImage className="h-5 w-5 text-green-500" />
                  <span>Photo</span>
                </Link>
                <Link
                  href="/create-post"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <FiVideo className="h-5 w-5 text-blue-500" />
                  <span>Video</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        {isLoading && posts.length === 0 ? (
          <PostSkeletonList count={3} />
        ) : error ? (
          <div className="card text-center">
            <p className="text-red-500">{error}</p>
            <button onClick={refresh} className="btn-secondary mt-4">
              Try Again
            </button>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-4">
              {isLoading && (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-center text-sm text-slate-500">
                  You've reached the end
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-slate-500">No posts yet</p>
            {isAuthenticated && (
              <Link
                href="/create-post"
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                <FiPlus className="h-4 w-4" />
                Create the first post
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block lg:w-80">
        <div className="sticky top-24">
          <SuggestedUsers />
        </div>
      </aside>
    </div>
  );
}
