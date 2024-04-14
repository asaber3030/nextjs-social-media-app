"use client";

import { Suspense, useContext } from "react";

import { TabsContent } from "@/components/ui/tabs"
import { UserItems } from "@/providers/user-items";
import { Post, User } from "@/types"
import { SinglePost } from "../../posts/post";
import { showS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getMyPosts } from "@/actions/post";
import { PostSkeleton } from "../../skeleton/post-loading-skeleton";
import { EmptyPosts } from "../../posts/empty-posts";

interface Props {
   current: User, 
   user: User 
}

export const ArchivedPostsTab = ({ current, user }: Props) => {

  const { archivedPosts } = useContext(UserItems)

  return (
    <TabsContent value="archived">
      <h4 className='pb-2 border-b text-lg flex justify-between items-center mb-2'>
        <span>Archived Posts</span>
        <span className='text-gray-500 text-sm'>{archivedPosts?.length} {showS('post', archivedPosts?.length)}</span>
      </h4>
      {archivedPosts?.length && archivedPosts?.length > 0 ? (
        <>
          {archivedPosts.map((post: Post) => (
            <SinglePost showBottomAction={false} post={post} />
          ))}
        </>
      ): (
        <EmptyPosts />
      )}
    </TabsContent>
  )
}