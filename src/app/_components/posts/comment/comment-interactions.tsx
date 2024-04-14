"use client";

import { useUser } from "@/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dislikeComment, getCommentReplies, hasLikedComment, likeComment } from "@/actions/post";

import { Comment, CommentReply } from "@/types";

import { Heart, Reply } from "lucide-react";
import { PostButton } from "../post-button";
import { CommentActions } from "./comment-actions";

export const CommentInteractions = ({ comment, toggleRepliesStatus, toggleSendRepliesStatus }: { toggleRepliesStatus: any, toggleSendRepliesStatus: any, comment: Comment }) => {

  const { user: current } = useUser()

  const repliesQuery = useQuery({
    queryKey: ['user', comment.postId, comment.id, 'comments', 'replies'],
    queryFn: ({ queryKey }) => getCommentReplies(queryKey[2] as number)
  })

  const replies: CommentReply[] = repliesQuery?.data?.data
  
  const queryClient = useQueryClient()

  const hasLikeQuery = useQuery({
    queryKey: ['user', comment.id, 'likes', 'comments'],
    queryFn: ({ queryKey }) => hasLikedComment(current?.id as number, queryKey[1] as number)
  })

  const likeAction = useMutation({
    mutationFn: ({ userId, commentId, commentOwnerId }: { userId: number, commentId: number, commentOwnerId: number }) => likeComment(commentOwnerId, commentId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', comment.postId, 'comments'] })
      queryClient.invalidateQueries({ queryKey: ['user', comment.id, 'likes', 'comments'] })
    }
  })
  const disLikeAction = useMutation({
    mutationFn: ({ userId, commentId }: { userId: number, commentId: number }) => dislikeComment(commentId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', comment.postId, 'comments'] })
      queryClient.invalidateQueries({ queryKey: ['user', comment.id, 'likes', 'comments'] })
    }
  })

  const handleLike = () => {
    likeAction.mutate({ commentOwnerId: comment?.userId, userId: current?.id as number, commentId: comment?.id })
  }
  const handleDisLike = () => {
    disLikeAction.mutate({ userId: current?.id as number, commentId: comment?.id })
  }

  return (
    <div className='mt-4 flex gap-1 justify-end'>
      {hasLikeQuery?.data == true ? (
        <PostButton
          onClick={handleDisLike} 
          icon={Heart} 
          number={comment?._count?.likes as number}
          fill='red'
          stroke='red'
        />
      ): (
        <PostButton 
          onClick={handleLike} 
          icon={Heart} 
          number={comment?._count?.likes as number}
          fill={undefined}
          stroke='white'
        />
      )}
      <PostButton
        icon={Reply}
        number={replies?.length ? replies?.length : 0}
        onClick={toggleSendRepliesStatus}
      />
      <CommentActions comment={comment} />
    </div>
  );
}