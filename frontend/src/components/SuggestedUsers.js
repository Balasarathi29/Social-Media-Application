"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { userAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

export default function SuggestedUsers() {
  const { user, isAuthenticated, followUser } = useAuthStore();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      fetchSuggestedUsers();
    }
  }, [isAuthenticated]);

  const fetchSuggestedUsers = async () => {
    try {
      const { data } = await userAPI.getSuggested();
      setSuggestedUsers(data);
    } catch (error) {
      console.error("Failed to fetch suggested users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    setFollowingIds((prev) => new Set([...prev, userId]));
    const result = await followUser(userId);
    if (result.success) {
      toast.success("User followed!");
      setSuggestedUsers((prev) => prev.filter((u) => u._id !== userId));
    } else {
      setFollowingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      toast.error(result.error);
    }
  };

  const getAvatarUrl = (userItem) => {
    return (
      userItem?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem?.username || "User")}&background=0ea5e9&color=fff`
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Suggested Users
      </h3>

      {isLoading ? (
        <div className="py-8">
          <LoadingSpinner />
        </div>
      ) : suggestedUsers.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {suggestedUsers.map((userItem) => (
            <li
              key={userItem._id}
              className="flex items-center justify-between gap-3"
            >
              <Link
                href={`/profile/${userItem._id}`}
                className="flex items-center gap-3 min-w-0"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-700">
                  <Image
                    src={getAvatarUrl(userItem)}
                    alt={userItem.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 hover:text-primary-500 dark:text-slate-100">
                    {userItem.username}
                  </p>
                  {userItem.bio && (
                    <p className="line-clamp-1 truncate text-xs text-slate-500">
                      {userItem.bio}
                    </p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => handleFollow(userItem._id)}
                disabled={followingIds.has(userItem._id)}
                className="btn-outline shrink-0 px-3 py-1 text-xs"
              >
                {followingIds.has(userItem._id) ? "Following" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center text-sm text-slate-500">
          No suggestions available
        </p>
      )}
    </div>
  );
}
