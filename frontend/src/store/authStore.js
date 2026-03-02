"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI, userAPI } from "@/lib/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("token", token);
          } else {
            localStorage.removeItem("token");
          }
        }
        set({ token });
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(userData);
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }
          return { success: true, data };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.message || "Registration failed",
          };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login(credentials);
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }
          return { success: true, data };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.message || "Login failed",
          };
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await authAPI.getMe();
          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          get().logout();
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      followUser: async (userId) => {
        try {
          await userAPI.follow(userId);
          set((state) => ({
            user: {
              ...state.user,
              following: [...state.user.following, userId],
            },
          }));
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Failed to follow user",
          };
        }
      },

      unfollowUser: async (userId) => {
        try {
          await userAPI.unfollow(userId);
          set((state) => ({
            user: {
              ...state.user,
              following: state.user.following.filter((id) => id !== userId),
            },
          }));
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Failed to unfollow user",
          };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
