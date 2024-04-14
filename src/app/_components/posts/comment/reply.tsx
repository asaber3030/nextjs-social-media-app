"use client";

import moment from "moment"
import Link from "next/link"

import { Comment, CommentReply } from "@/types"
import { ReplyInteractions } from "./reply-interactions";

import { useUser } from "@/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dislikeReply, hasLikedReply, likeReply } from "@/actions/post";
import { route } from "@/lib";

export const SingleReply = ({ reply, comment }: { comment: Comment, reply: CommentReply }) => {

  const { user: current } = useUser()

  return (
    <div>
      
      <div className='p-4 bg-lightBg rounded-md gap-2 text-xs'>
        
        <Link href={route('profile', current?.username)} className='text-blue-600 hover:underline font-normal'>
          @{reply.user?.username}
        </Link>

        <p className='flex items-center justify-between'>
        <span>{reply.reply}</span>
          <span className='text-gray-600'>Replied {moment(reply.createdAt).fromNow()} </span>
        </p>
      </div>

      <ReplyInteractions reply={reply} comment={comment}  />
    </div>
  )
}