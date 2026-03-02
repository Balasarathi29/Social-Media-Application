"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiSettings, FiGrid, FiUsers } from "react-icons/fi";
import { userAPI } from "@/lib/api";
import { useUserPosts } from "@/hooks/usePosts";
import useAuthStore from "@/store/authStore";
import PostCard from "@/components/PostCard";
import { PostSkeletonList } from "@/components/PostSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const {
    user: currentUser,
    isAuthenticated,
    followUser,
    unfollowUser,
  } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const {
    posts,
    setPosts,
    isLoading: isLoadingPosts,
    hasMore,
    loadMore,
  } = useUserPosts(params.id);

  const isOwnProfile = currentUser?._id === params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const { data } = await userAPI.getProfile(params.id);
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile");
        router.push("/feed");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [params.id, router]);

  useEffect(() => {
    if (currentUser && profile) {
      const following = currentUser.following?.some(
        (f) => f === profile._id || f._id === profile._id,
      );
      setIsFollowing(following);
    }
  }, [currentUser, profile]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to follow users");
      router.push("/login");
      return;
    }

    setIsFollowLoading(true);
    if (isFollowing) {
      const result = await unfollowUser(profile._id);
      if (result.success) {
        setIsFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followersCount:
            (prev.followersCount || prev.followers?.length || 1) - 1,
        }));
        toast.success("Unfollowed");
      } else {
        toast.error(result.error);
      }
    } else {
      const result = await followUser(profile._id);
      if (result.success) {
        setIsFollowing(true);
        setProfile((prev) => ({
          ...prev,
          followersCount:
            (prev.followersCount || prev.followers?.length || 0) + 1,
        }));
        toast.success("Following");
      } else {
        toast.error(result.error);
      }
    }
    setIsFollowLoading(false);
  };

  const handleDeletePost = useCallback(
    (postId) => {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setProfile((prev) => ({
        ...prev,
        postsCount: Math.max((prev.postsCount || 1) - 1, 0),
      }));
    },
    [setPosts],
  );

  const getAvatarUrl = (user) => {
    return (
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=0ea5e9&color=fff&size=200`
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card text-center">
        <p className="text-slate-500">Profile not found</p>
        <Link href="/feed" className="btn-primary mt-4">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Profile Header */}
      <div className="card">
        {/* Cover Image */}
        {profile.coverImage && (
          <div className="relative -mx-6 -mt-6 mb-4 h-64 overflow-hidden rounded-t-xl bg-gradient-to-r from-primary-400 to-primary-600">
            <Image
              src={profile.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div
            className={`relative h-32 w-32 overflow-hidden rounded-full border-4 border-white ring-2 ring-slate-100 dark:border-slate-800 dark:ring-slate-700 ${
              profile.coverImage ? "-mt-16" : ""
            }`}
          >
            <Image
              src={getAvatarUrl(profile)}
              alt={profile.username}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {isOwnProfile ? (
                <Link
                  href="/edit-profile"
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiSettings className="h-4 w-4" />
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  className={isFollowing ? "btn-secondary" : "btn-primary"}
                >
                  {isFollowLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : isFollowing ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 flex justify-center gap-8 border-t border-slate-100 pt-4 dark:border-slate-700 sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {profile.postsCount || 0}
                </p>
                <p className="text-sm text-slate-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {profile.followersCount || profile.followers?.length || 0}
                </p>
                <p className="text-sm text-slate-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {profile.followingCount || profile.following?.length || 0}
                </p>
                <p className="text-sm text-slate-500">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <FiGrid className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Posts
          </h2>
        </div>

        {isLoadingPosts && posts.length === 0 ? (
          <PostSkeletonList count={2} />
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={loadMore}
                  disabled={isLoadingPosts}
                  className="btn-secondary"
                >
                  {isLoadingPosts ? <LoadingSpinner size="sm" /> : "Load More"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-slate-500">No posts yet</p>
            {isOwnProfile && (
              <Link href="/create-post" className="btn-primary mt-4">
                Create your first post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
