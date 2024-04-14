"use client";

import { TabsContent } from "@/components/ui/tabs"
import { SinglePost } from "../../posts/post";
import { EmptyPosts } from "../../posts/empty-posts";

import { Post,  User } from "@/types"
import { UserItems } from "@/providers/user-items";

import { showS } from "@/lib/utils";
import { useContext } from "react";

interface Props {
   current: User, 
   user: User 
}

export const TrashedPostsTab = ({ current, user }: Props) => {

  const { trashedPosts } = useContext(UserItems)

  return (
    <TabsContent value="trashed">
      <h4 className='pb-2 border-b text-lg flex justify-between items-center mb-2'>
        <span>Trashed Posts</span>
        <span className='text-gray-500 text-sm'>{trashedPosts?.length} {showS('post', trashedPosts?.length)}</span>
      </h4>
      {trashedPosts?.length && trashedPosts?.length > 0 ? (
        <>
          {trashedPosts.map((post: Post) => (
            <SinglePost showBottomAction={false} post={post} />
          ))}
        </>
      ): (
        <EmptyPosts />
      )}
    </TabsContent>
  )
}