"use client";

import { createContext } from "react";
import { Follower, Following, User, Post, Notification } from "@/types";

type UserItemsType = {
  followings: Following[],
  followers: Follower[],
  uploads: any,
  posts: Post[],
  followingsNumber: number,
  followersNumber: number,
  user: User,
  current: User,
  notifications: Notification[],
  savedPosts: any,
  archivedPosts: any,
  trashedPosts: any,
  postsNumber: number,
}

export const UserItems = createContext<UserItemsType>({
  followings: [],
  followers: [],
  followingsNumber: 0,
  followersNumber: 0,
  uploads: [],
  posts: [],
  user: {} as User,
  current: {} as User,
  notifications: [],
  savedPosts: [],
  archivedPosts: [],
  trashedPosts: [],
  postsNumber: 0,
})


const UserItemsProvider = ({ children, value }: { children: React.ReactNode, value: any }) => {
  return (
    <UserItems.Provider value={value}>
      {children}
    </UserItems.Provider>
  );
}
 
export default UserItemsProvider;