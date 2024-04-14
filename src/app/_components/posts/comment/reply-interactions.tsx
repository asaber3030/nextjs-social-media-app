"use client";

import moment from "moment"
import Link from "next/link"

import { Comment, CommentReply } from "@/types"
import { PostButton } from "../post-button"
import { Heart } from "lucide-react"

import { useUser } from "@/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dislikeReply, hasLikedReply, likeReply } from "@/actions/post";
import { ReplyActions } from "./reply-actions";

export const ReplyInteractions = ({ reply, comment }: { comment: Comment, reply: CommentReply }) => {

  const { user: current } = useUser()

  const queryClient = useQueryClient()

  const hasLikeQuery = useQuery({
    queryKey: ['user', reply.id, 'comments', 'replies', 'likes'],
    queryFn: () => hasLikedReply(current?.id as number, reply.id)
  })

  const likeAction = useMutation({
    mutationFn: ({ userId, replyId, replyOwnerId }: { userId: number, replyId: number, replyOwnerId: number }) => likeReply(replyOwnerId, replyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', reply.comment?.postId, reply.commentId, 'comments', 'replies'] })
      queryClient.invalidateQueries({ queryKey: ['user', reply.id, 'comments', 'replies', 'likes'] })
      queryClient.invalidateQueries({ queryKey: ['user', reply?.comment?.postId, reply.commentId, 'comments', 'replies'] })
    }
  })
  const disLikeAction = useMutation({
    mutationFn: ({ userId, replyId }: { userId: number, replyId: number }) => dislikeReply(replyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', reply.comment?.postId, reply.commentId, 'comments', 'replies'] })
      queryClient.invalidateQueries({ queryKey: ['user', reply.id, 'comments', 'replies', 'likes'] })
      queryClient.invalidateQueries({ queryKey: ['user', reply?.comment?.postId, reply.commentId, 'comments', 'replies'] })
    }
  })

  const handleLike = () => {
    likeAction.mutate({ replyOwnerId: reply?.userId, userId: current?.id as number, replyId: reply?.id })
  }
  const handleDisLike = () => {
    disLikeAction.mutate({ userId: current?.id as number, replyId: reply?.id })
  }

  return (
    <div className='flex justify-end gap-2 mt-2'>
      {!hasLikeQuery.isLoading && (
        <>
          {hasLikeQuery?.data == true ? (
            <PostButton
              onClick={handleDisLike} 
              icon={Heart} 
              number={reply?._count?.likes as number}
              fill='red'
              stroke='red'
            />
          ): (
            <PostButton 
              onClick={handleLike} 
              icon={Heart} 
              number={reply?._count?.likes as number}
              fill={undefined}
              stroke='white'
            />
          )}
        </>
      )}
      <ReplyActions postId={comment.id} reply={reply} />
    </div>
  )
}