"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { Following, User } from "@/types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserItems } from "@/providers/user-items";
import { EmptyState } from "./empty-list";
import { PrivateContent } from "../private-content";
import { LoadingButton } from "@/components/loading-button";

import { unfollow } from "@/actions/user";
import { revalidate } from "@/actions";
import { toast } from "sonner";
import { route } from "@/lib/url";
import { UserAvatar } from "./avatar";
import { FollowButton } from "./follow-button";

interface DisplayFollowingsProps {
  followings: Following[],
  username: string,
}

export const FollowingComponent = ({ followings }: { followings: Following[] }) => {

  const { user, current } = useContext(UserItems)
  
  if (user?.private && current?.id != user?.id) {
    return (
      <div>
        <FollowingComponent.Title username={user?.username} isLoading={false} />
        <PrivateContent label={<span>User <b>{user.name}</b> has made data private you cannot see his followings!</span>} />
      </div>
    )
  }

  return (
    <div>
      <FollowingComponent.Title username={user?.username} isLoading={false} />
      <FollowingComponent.DisplayFollowings
        username={user?.username as string}
        followings={followings as []}
      />
    </div>
  )
}

FollowingComponent.DisplayFollowings = ({ username, followings }: DisplayFollowingsProps) => {
  return (
    <div className='flex flex-col gap-y-2'>
      {followings?.length === 0 ? (
        <React.Fragment>
          <EmptyState title="You don't have followings!" />
          <Link href={`/profile/${username}`}><Button asChild>Profile</Button></Link>
        </React.Fragment>
      ): (
        <React.Fragment>
          {followings.map((following: Following) => (
            <FollowingComponent.Following key={`following-idx-${following.id}`} following={following} />
          ))}
        </React.Fragment>
      )}
    </div>
  )
}

FollowingComponent.Following = ({ following }: { following: Following }) => {

  const unfollowMutation = useMutation({
    mutationFn: () => unfollow(following.id, following.followingId),
    onSuccess: () => {
      toast.message(`You have un followed @${following.following?.username}`)
      revalidate(`/profile/${following.following?.username}/followings`)
    }
  })

  return (
    <div className='flex gap-4 items-center justify-between' key={following.id}>
      <section className='flex gap-4 items-center py-2'>
        <UserAvatar user={following.following as User} />
        <div>
          <h4 className='font-bold'>{following.following?.name}</h4>
          <p className='text-xs text-gray-500'><Link href={`/profile/${following.following?.username}`}>@{following.following?.username}</Link></p>
        </div>
      </section>
      <div className='flex justify-between'>
        
        <div>
          <FollowButton whoIWillFollow={following.followingId} follower={following.userId as number} />
        </div>
      </div>
    </div>
  )
}

FollowingComponent.Title = ({ isLoading, username }: { username?: string, isLoading?: boolean }) => {
  return (
    <header className='flex items-center justify-between mb-2'>
      <h2 className='text-xl font-semibold'>Following List</h2>
      {!isLoading && (
        <Link href={route('profile', username)} className='text-sm text-gray-500 hover:underline'>@{username}</Link>
      )}
      {isLoading && (
        <Skeleton className='w-[100px] h-3' />
      )}
    </header>
  )
}