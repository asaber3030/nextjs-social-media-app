"use client";

import Link from "next/link";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCommentReplies } from "@/actions/post";

import { Comment, User, CommentReply } from "@/types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Replies } from "./comment-replies";
import { WriteReply } from "./write-reply";
import { UserAvatar } from "../../user/avatar";

import { route } from "@/lib";
import { dateForHuman } from "@/lib/utils";
import { CommentInteractions } from "./comment-interactions";

export const SingleComment = ({ user, comment }: { user: User, comment: Comment }) => {

  const [repliesStatus, setRepliesStatus] = useState(false)
  const [sendReplyStatus, setSendReplyStatus] = useState(false)

  const repliesQuery = useQuery({
    queryKey: ['user', comment.postId, comment.id, 'comments', 'replies'],
    queryFn: ({ queryKey }) => getCommentReplies(queryKey[2] as number)
  })

  const replies: CommentReply[] = repliesQuery?.data?.data

  const toggleRepliesStatus = () => {
    setRepliesStatus(old => !old)
  }
  const toggleSendRepliesStatus = () => {
    setSendReplyStatus(old => !old)
  }

  return (
    <div className='flex gap-5 py-3'>
      
      <UserAvatar user={user} avatarSize='10' />

      <div className='w-full'>
        
        <Link href={route('profile', user?.username)}>{user?.name}</Link>
        <p className='text-xs text-gray-500 mt-0'>{dateForHuman(comment.createdAt)}</p>
        
        <div className='mt-2 rounded-lg bg-lightBg py-4 px-6 mb-2'>
          <p>{comment.comment}</p>
          <CommentInteractions 
            toggleRepliesStatus={toggleRepliesStatus}
            toggleSendRepliesStatus={toggleSendRepliesStatus} 
            comment={comment} 
          />
        </div>

        {sendReplyStatus && (
          <WriteReply comment={comment} />
        )}

        <div className='flex gap-2'>
          {replies?.length > 0 && (
            <Button onClick={toggleRepliesStatus} className={`px-1`} variant='link'>{repliesStatus ? 'Hide' : 'Show'} replies ({replies?.length} replies)</Button>
          )}
          <Button onClick={toggleSendRepliesStatus} className={`px-1`} variant='link'>Reply</Button>
        </div>

        {repliesStatus && (
          <div className='mt-2'>
            {repliesQuery.isLoading ? (
              <SingleComment.LoadingReplies />
            ): (
              <Replies comment={comment} replies={replies} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

SingleComment.LoadingReplies = () => {
  return (
    <div className='flex flex-col gap-y-2'>
      <Skeleton className='w-[80px] h-2' />
      <Skeleton className='w-[400px] h-2' />
      <Skeleton className='w-[150px] h-2' />
      <Skeleton className='w-[250px] h-2' />
      <div className="flex justify-end">
        <Skeleton className='w-[80px] h-2' />
      </div>
      <div className="flex justify-end">
        <Skeleton className='w-[40px] h-8' />
      </div>
    </div>
  )
}