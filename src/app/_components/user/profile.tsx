"use client";

import React from "react";
import Link from "next/link";

import { useContext} from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { numberForUsers } from "@/lib/utils";
import { route } from "@/lib";

import { Check, Cog, Plus } from "lucide-react";
import { UserItems } from "@/providers/user-items";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs"

import { UserAvatar } from "./avatar";
import { UserProfileTabs } from "./tab-triggers";
import { PostsTab } from "./tabs/posts-tab";
import { SavedPostsTab } from "./tabs/saved-posts-tab";
import { ArchivedPostsTab } from "./tabs/archived-posts-tab";
import { TrashedPostsTab } from "./tabs/trashed-posts-tab";
import { PrivateContent } from "../private-content";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { follow, isFollowingData, unfollow } from "@/actions/user";
import { NewCollectionButton } from "./collections/new-collection-button";
import { UserCollections } from "./collections/collections";
import { FollowButton } from "./follow-button";

export const ProfileComponent = ({ isFriends }: { isFriends: boolean }) => {
  
  const searchParams = useSearchParams()
  const qc = useQueryClient()
  
  const { username }: { username: string } = useParams()
  const { followersNumber, followingsNumber, postsNumber, user, current } = useContext(UserItems)

  if (!user) return notFound()

  return (

    <div>
      {/* Header */}
      <section className='flex gap-10 py-8 pb-4'>
        
        <div className='xl:min-w-[130px] lg:min-h-[150px] xl:max-w-[130px] lg:max-h-[150px] h-[150px] w-[150px]'>
          <UserAvatar avatarSize="24" user={user} />
        </div>

        <div className='w-full'>
          <section className='flex gap-1 items-center'>
            {current?.username === username && (
              <React.Fragment>
                <Link href={route('editProfile', username)}><Button size='sm' variant='secondary'>Edit Profile</Button></Link>
                <Link href={route('editPicture', username)}><Button size='sm' variant='secondary'>Update Picture</Button></Link>
                <Link href={route('settings', username)}><Button size='sm' variant='secondary'><Cog className='size-5' /></Button></Link>
              </React.Fragment>
            )}
          </section>

          <section className='flex gap-8 my-4 text-gray-300 text-xs'>
            <p>{numberForUsers(postsNumber)} posts</p>
            <p><Link href={route('followers', username)}>{numberForUsers(followersNumber)} followers</Link></p>
            <p><Link href={route('followings', username)}>{numberForUsers(followingsNumber)} following</Link></p>
          </section>
          
          <section className='flex flex-col gap-y-4'>
            <h2 className='text-lg font-semibold text-gray-300'>{user?.name}</h2>
            {user?.bio && <p className='text-xs text-gray-400 leading-5'>{user?.bio}</p>}
            {user?.website && <a target='_blank' href={user?.website} className='text-xs w-fit text-blue-400 hover:underline'>{user?.website}</a>}
          </section>

          {username != current.username && (
            <FollowButton className='w-full my-2' variant='secondary' whoIWillFollow={user.id} follower={current.id} />
          )}

          {user?.username === current.username && (
            <NewCollectionButton>
              <Button size='sm' className='h-9 w-full mt-4'><Plus className='size-4' /> New Collection</Button>
            </NewCollectionButton>
          )}

          <UserCollections />

        </div>

      </section>

      {(!user?.private || user?.id == current?.id || isFriends) ? (
        <Tabs defaultValue={searchParams.get('tab') ?? 'posts'} className='mt-2'>
        
          <UserProfileTabs user={user} current={current} />

          <PostsTab user={user} current={current} />

          {user?.username === current.username && (
            <React.Fragment>
              <SavedPostsTab />
              <ArchivedPostsTab user={user} current={current} />
              <TrashedPostsTab user={user} current={current} />
            </React.Fragment>
          )}
        </Tabs>
      ): (
        <PrivateContent label={<span>User <b className='text-blue-200'>{user?.name}</b> has chosen to make his profile private. Follow each other so you can see his posts & reels</span>} />
      )}

    </div>
  )
}

ProfileComponent.Loading = () => {
  return (
    <div>
      <section className='flex gap-10'>
        <Skeleton className='w-[100px] h-[100px] rounded-sm' />
          
        <div className='w-full'>
          {/* Actions */}
          <div className='flex items-center gap-1'>
            <Skeleton className='w-[80px] h-8 rounded-sm' />
            <Skeleton className='w-[80px] h-8 rounded-sm' />
            <Skeleton className='w-[80px] h-8 rounded-sm' />
          </div>

          {/* Followers & Posts & Followings */}
          <section className='flex gap-1 my-4 text-gray-300 text-xs'>
            <Skeleton className='w-[80px] h-2 rounded-sm' />
            <Skeleton className='w-[80px] h-2 rounded-sm' />
            <Skeleton className='w-[80px] h-2 rounded-sm' />
          </section>

          {/* Name & Bio */}
          <section className='flex flex-col gap-1 my-4 text-gray-300 text-xs'>
            <Skeleton className='w-[150px] h-5 mb-5 rounded-sm' />
            <Skeleton className='w-[400px] h-2 rounded-sm' />
            <Skeleton className='w-[500px] h-2 rounded-sm' />
            <Skeleton className='w-[150px] h-2 rounded-sm' />
          </section>

          {/* Plus button */}
          <section className='my-4'>
            <Skeleton className='w-[80px] h-[80px] mb-5 rounded-sm' />
          </section>
        </div>
      </section>
    </div>
  )
}
