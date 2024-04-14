"use client";

import React, { useContext } from "react";

import { TabsContent } from "@/components/ui/tabs"
import { UserItems } from "@/providers/user-items";
import { Post, SavedPost } from "@/types"
import { SinglePost } from "../../posts/post";
import { EmptyPosts } from "../../posts/empty-posts";

import { showS } from "@/lib/utils";

export const SavedPostsTab = () => {

  const { savedPosts } = useContext(UserItems)
  const posts = savedPosts.map((item: SavedPost) => item.post)

  return (
    <TabsContent value="saved">
      <h4 className='pb-2 border-b text-lg flex justify-between items-center mb-2'>
        <span>Saved Posts</span>
        <span className='text-gray-500 text-sm'>{posts?.length} {showS('post', posts?.length)}</span>
      </h4>
      {posts?.length && posts?.length > 0 ? (
        <React.Fragment>
          {posts.map((post: Post) => (
            <SinglePost
              key={`post-idx-${post?.id}`}
              showBottomAction={false} 
              post={post}
            />
          ))}
        </React.Fragment>
      ): (
        <EmptyPosts />
      )}
    </TabsContent>
  )
}