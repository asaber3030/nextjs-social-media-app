"use client";

import { TabsContent } from "@/components/ui/tabs"
import { PostsList } from "../../posts/posts-list";
import { WritePost } from "../../posts/write-post";
import { User } from "@/types"

interface Props {
   current: User, 
   user: User 
}

export const PostsTab = ({ current, user }: Props) => {
  return (
    <TabsContent value="posts">
      {user?.username === current.username && (
        <WritePost />
      )}
      <PostsList 
        title={<span>@{user?.username}'s Posts</span>} 
        userId={current?.id} 
      />
    </TabsContent>
  );
}