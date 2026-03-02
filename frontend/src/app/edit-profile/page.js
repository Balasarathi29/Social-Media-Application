"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import { userAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profileImage: "",
    coverImage: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        coverImage: user.coverImage || "",
      });
      setProfilePreview(user.profileImage || "");
      setCoverPreview(user.coverImage || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "profileImage") {
      setProfilePreview(e.target.value);
      setProfileImageFile(null);
    }

    if (e.target.name === "coverImage") {
      setCoverPreview(e.target.value);
      setCoverImageFile(null);
    }
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImageFile(file);
    setProfilePreview(previewUrl);
    setFormData((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCoverImageFile(file);
    setCoverPreview(previewUrl);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("bio", formData.bio || "");

      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      } else {
        payload.append("profileImage", formData.profileImage || "");
      }

      if (coverImageFile) {
        payload.append("coverImage", coverImageFile);
      } else {
        payload.append("coverImage", formData.coverImage || "");
      }

      const { data } = await userAPI.updateProfile(user._id, payload);
      updateUser(data);
      toast.success("Profile updated!");
      router.push(`/profile/${user._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarUrl = () => {
    return (
      profilePreview ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.username || "User")}&background=0ea5e9&color=fff&size=200`
    );
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl">
        <div className="card">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-slate-100 dark:ring-slate-700">
                  <Image
                    src={getAvatarUrl()}
                    alt={formData.username}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="input"
                />
                <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Or Upload Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileFileChange}
                  className="input"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
                className="input"
              />
              <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Or Upload Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="input"
              />
              {coverPreview && (
                <div className="mt-2 relative h-32 overflow-hidden rounded-lg">
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                minLength={3}
                maxLength={30}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="input resize-none"
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
              <div className="mt-1 text-right text-sm text-slate-400">
                {formData.bio.length}/200
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end border-t border-slate-100 pt-6 dark:border-slate-700">
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
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
