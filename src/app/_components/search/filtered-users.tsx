"use client";

import React from "react";
import Link from "next/link";

import { FollowButton } from "../user/follow-button";
import { UserAvatar } from "../user/avatar";
import { User } from "@/types";

import { route } from "@/lib";

interface Props {
  users: User[],
  current: User,
  isFetching: boolean
}

export const FilteredUsers = ({ users, current }: Props) => {
  return (
    <div className='space-y-4'>
      {users?.map((user, idx) => (
        <FilteredUsers.User 
          key={`filtered-user-idx-${user?.id}`} 
          current={current} 
          user={user} 
        />
      ))}
    </div>
  );
}

FilteredUsers.User = ({ user, current }: { current: User, user: User }) => {
  return (
    <div className='flex gap-4 items-center my-4'>
      
      <Link href={route('profile', user?.username)}><UserAvatar user={user} /></Link>
     
      <div className='flex justify-between w-full'>
        
        <div>
          <Link className='font-bold block' href={route('profile', user?.username)}>{user?.name}</Link>
          <Link className='text-gray-500 text-sm' href={route('profile', user?.username)}>@{user?.username}</Link>
        </div>

        <FollowButton whoIWillFollow={user?.id} follower={current.id} />

      </div>

    </div>
  )
} 