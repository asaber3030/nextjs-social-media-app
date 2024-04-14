"use client";

import { Post } from "@/types";
import { SinglePost } from "./post";

interface Props {
  post: Post
}

export const ViewPost = ({ post }: Props) => {
  return (
    <div>
      <SinglePost 
        post={post} 
        showComments={true} 
      />
    </div>
  );
}