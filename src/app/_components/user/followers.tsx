"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useContext } from "react";
import { route } from "@/lib/url";

import { Follower } from "@/types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserItems } from "@/providers/user-items";
import { EmptyState } from "./empty-list";
import { PrivateContent } from "../private-content";

interface DisplayFollowingsProps {
  followers: Follower[],
  username: string,
}

export const FollowersComponent = ({ followers }: { followers: Follower[] }) => {

  const { user, current } = useContext(UserItems)
  
  if (user?.private && current?.id != user?.id) {
    return (
      <div>
        <FollowersComponent.Title username={user?.username} isLoading={false} />
        <PrivateContent label={<span>User <b>{user.name}</b> has made data private you cannot see his followers!</span>} />
      </div>
    )
  }

  return (
    <div>
      <FollowersComponent.Title username={user?.username} isLoading={false} />
      <FollowersComponent.DisplayFollowers
        username={user?.username as string}
        followers={followers as []}
      />
    </div>
  )
}

FollowersComponent.DisplayFollowers = ({ username, followers }: DisplayFollowingsProps) => {
  return (
    <div className='flex flex-col gap-y-2'>
      {followers?.length === 0 ? (
        <React.Fragment>
          <EmptyState title="You don't have followers!" />
          <Link href={`/profile/${username}`}><Button asChild>Profile</Button></Link>
        </React.Fragment>
      ): (
        <React.Fragment>
          {followers.map((follower: Follower) => (
            <FollowersComponent.Follower follower={follower} />
          ))}
        </React.Fragment>
      )}
    </div>
  )
}

FollowersComponent.Follower = ({ follower }: { follower: Follower }) => {
  return (
    <div className='flex gap-4 items-center px-3 justify-between border rounded-md' key={follower.id}>
      <section className='flex gap-4 items-center py-4'>
        <div>
          <Image 
            alt='User picture' 
            width={100} 
            height={100} 
            src={follower.follower?.picture ?? '/defaults/users-svg.svg'} 
            className="rounded-full object-cover w-[50px] h-[50px]" 
          />
        </div>
        <div>
          <h4 className='font-bold'>{follower.follower?.name}</h4>
          <p className='text-xs text-gray-500'><Link href={`/profile/${follower.follower?.username}`}>@{follower.follower?.username}</Link></p>
        </div>
      </section>
    </div>
  )
}

FollowersComponent.Title = ({ isLoading, username }: { username?: string, isLoading?: boolean }) => {
  return (
    <header className='flex items-center justify-between mb-2'>
      <h2 className='text-xl font-semibold'>Followers List</h2>
      {!isLoading && (
        <Link href={route('profile', username)} className='text-sm text-gray-500 hover:underline'>@{username}</Link>
      )}
      {isLoading && (
        <Skeleton className='w-[100px] h-3' />
      )}
    </header>
  )
}