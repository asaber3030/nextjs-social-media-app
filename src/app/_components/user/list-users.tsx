"use client";

import Image from "next/image";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { follow, getFollowingsByUsername, getUsers, unfollow } from "@/actions/user";
import { Following } from "@/types";
import { useUser } from "@/hooks";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";

export const ListUsersComponent = () => {

  const { user: current, isLoading: userLoading } = useUser()

  const qc = useQueryClient()

  const followings = useQuery({
    queryKey: ['users', 'followings'],
    queryFn: () => getFollowingsByUsername(current?.username as string),
  })

  const usersQuery = useQuery({
    queryKey: ['users', 'fetch'],
    queryFn: () => getUsers(),
    retry: 1,
    queryHash: 'sadasfdsaikfghjasdlkghds'
  })

  const followMutation = useMutation({
    mutationFn: ({ userId, follower }: { userId: number, follower: number }) => follow(userId, follower),
    onSuccess: (data) => {
      toast.message(data.message),
      qc.invalidateQueries({ queryKey: ['users', current?.username, 'followings'] })
    }
  })

  const unfollowMutation = useMutation({
    mutationFn: ({ followId, followingId }: { followId: number, followingId: number }) => unfollow(followId, followingId),
    onSuccess: (data) => {
      toast.message(data?.message)
      qc.invalidateQueries({ queryKey: ['users', current?.username, 'followings'] })
    }
  })

  const unfollowHandler = (followId: number, followingId: number) => {
    unfollowMutation.mutate({ followId, followingId })
  }
  
  const followHandler = ({ userId, follower }: { userId: number, follower: number }) => {
    followMutation.mutate({ userId, follower })
  }

  return (
    <div>
      <header className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Nearby Users</h2>
      </header>

      <div className="divide-y">
        {usersQuery.data?.users?.map((user: any) => {
          
          const isFollowing: any = (followings.data?.followings as [])?.find((following: Following) => following.followingId === user.id && following.userId === current?.id)

          return (
            <div className='flex gap-4 items-center py-1 justify-between'>
              <section className='flex gap-4 items-center py-4'>
                <div>
                  <Image src={user.picture ?? '/defaults/user-svg.svg'} alt='User picture' width={100} height={100} className="rounded-full object-cover w-[50px] h-[50px]" />
                </div>
                <div>
                  <h4 className='font-bold'>{user.name}</h4>
                  <p className='text-xs text-gray-500'><Link href={`/profile/${user.username}`}>@{user.username}</Link></p>
                </div>
              </section>
              <section className='flex gap-1'>
                {isFollowing ? (
                  <LoadingButton className='text-white text-xs' variant='outline' size='sm' onClick={ () => unfollowHandler(isFollowing?.id as number, user?.id) }>Unfollow</LoadingButton>
                ): (
                  <LoadingButton className='text-white text-xs' size='sm' onClick={ () => followHandler({ userId: current?.id as number, follower: user?.id }) }>Follow</LoadingButton>
                )}
              </section>
            </div>
          )
        })}
      </div>
    </div>
  )
}