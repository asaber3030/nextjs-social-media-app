"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useOptimistic, useContext } from 'react';

import { dislike, hasLiked, like } from '@/actions/post';
import { Post } from "@/types"

import { Heart } from "lucide-react"
import { PostButton } from '../post-button';
import { revalidate } from "@/actions";
import { route } from "@/lib";
import { UserContext } from "@/providers/user";

interface Props {
  post: Post,
}

export const LikePostActions = ({ post }: Props) => {

  const current = useContext(UserContext)
  const queryClient = useQueryClient()
  
  const hasLikeQuery = useQuery({
    queryKey: ['user', 'posts', post.id, 'likes'],
    queryFn: ({ queryKey }) => hasLiked(current.id, queryKey[2] as number)
  })

  const likeAction = useMutation({
    mutationFn: () => like(post.userId, post.id, current.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', post.id, 'likes'] }),
      revalidate(route('profile', current?.username))
    },
    onError:(err) => console.log(err)
  })

  const disLikeAction = useMutation({
    mutationFn: () => dislike(post.id, current.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', post.id, 'likes'] })
      revalidate(route('profile', current?.username))
    },
    onError:(err) => console.log(err)
  })

  const handleLike = () => {
    console.log({post})
    likeAction.mutate()
  }
  const handleDisLike = () => {
    disLikeAction.mutate()
  }

  return (
    <React.Fragment>
      {hasLikeQuery?.data == true ? (
        <PostButton
          onClick={handleDisLike} 
          icon={Heart} 
          number={post._count.likes}
          fill='red'
          stroke='red'
        />
      ): (
        <PostButton 
          onClick={handleLike} 
          icon={Heart} 
          number={post._count.likes}
          fill={undefined}
          stroke='white'
        />
      )}
    </React.Fragment>
  )
}