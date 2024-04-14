"use client";

import { Post, Comment, User } from "@/types";
import { WriteComment } from "./write-comment";
import { SingleComment } from "./comment";

export const PostComments = ({ comments, post }: { comments: Comment[], post: Post }) => {
  return (
    <section className='mt-3 pt-2'>
      <WriteComment post={post} />
      <div className='flex flex-col mt-2'>
        {comments?.map((comment: Comment) => (
          <SingleComment 
            key={`comment-idx-${comment.id}`} 
            comment={comment}
            user={comment.user as User} 
          />
        ))}
      </div>
    </section>
  )
}
