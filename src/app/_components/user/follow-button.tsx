"use client";

import { follow, isFollowingData, unfollow } from "@/actions/user";
import { Button, ButtonProps } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader, LucideIcon, Plus } from "lucide-react";

import React from "react";

interface Props extends ButtonProps {
  hasIcon?: boolean,
  icon?: LucideIcon,
  iconClassName?: string,
  children?: React.ReactNode,
  whoIWillFollow: number,
  follower: number,
}

export const FollowButton = ({ 
  whoIWillFollow,
  follower, 
  className, 
  size = 'sm',
  variant = 'outline', 
  iconClassName = 'size-4', 
  icon: Icon = Plus,
  hasIcon = true,
}: Props) => {

  const qc = useQueryClient()

  const followingQuery = useQuery({
    queryKey: ['user', 'followings', whoIWillFollow, follower],
    queryFn: ({ queryKey }) => isFollowingData(queryKey[2] as number, queryKey[3] as number),
    gcTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: true
  })

  const isFollowing = followingQuery.data?.isFollowing
  const followedData = followingQuery.data?.data

  const followMutation = useMutation({
    mutationFn: () => follow(whoIWillFollow, follower),
    onSuccess: (data) => {
      console.log(data)
      qc.invalidateQueries({ queryKey: ['user', 'followings', whoIWillFollow, follower] })
    }
  })

  const unfollowMutation = useMutation({
    mutationFn: () => unfollow(followedData?.id as number, whoIWillFollow),
    onSuccess: (data) => {
      console.log(data)
      qc.invalidateQueries({ queryKey: ['user', 'followings', whoIWillFollow, follower] })
    },
    retry: 5
  })

  const handleFollow = () => {
    followMutation.mutate()
  }

  const handleUnfollow = () => {
    unfollowMutation.mutate()
  }

  if (followingQuery.isLoading) return <Skeleton className='h-8 w-[80px]' />

  return (
    <Button 
      size={size}
      variant={variant}
      className={className}
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={followMutation.isPending || unfollowMutation.isPending}
    >
      {(followMutation.isPending || unfollowMutation.isPending) && <Loader className="size-4 animate-spin" />}
      {hasIcon && (
        <React.Fragment>
          {!isFollowing ? <Plus className={iconClassName} /> : <Check className={iconClassName} />}
        </React.Fragment>
      )}
      Follow
      {isFollowing && 'ed'}
    </Button>
  )
}