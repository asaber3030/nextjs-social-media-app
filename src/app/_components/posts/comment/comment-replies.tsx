"use client";

import { Comment, CommentReply } from "@/types"
import { SingleReply } from "./reply"

export const Replies = ({ replies, comment }: { comment: Comment, replies: CommentReply[] }) => {
  return (
    <div className='flex flex-col gap-y-1 ml-8'>
      {replies.map((reply: CommentReply) => (
        <SingleReply comment={comment} key={'reply-idx-' + reply.id} reply={reply} />
      ))}
    </div>
  )
}
