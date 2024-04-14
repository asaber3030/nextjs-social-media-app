"use client";

import { Post } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SinglePost } from "./post";

import { getMyPosts } from "@/actions/post";

import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserItems } from "@/providers/user-items";
import { EmptyPosts } from "./empty-posts";

interface Props {
  title?: React.ReactNode,
  userId: number
}

export const PostsList = ({ title }: Props) => {

  const { user } = useContext(UserItems)

  const postsQuery = useQuery({
    queryKey: ['user', 'posts', user?.id],
    queryFn: ({ queryKey }) => getMyPosts(queryKey[2] as number),
  })

  const posts: Post[] = postsQuery.data?.data

  if (postsQuery.isLoading && !postsQuery.isFetched) return <PostsList.Loading />
  if (postsQuery.data?.data?.length === 0) return <EmptyPosts />

  return (
    <div>
      
      <div className='flex flex-col'>
        {posts?.map((post: Post) => (
          <SinglePost 
            post={post} 
            key={'post-idx-' + post.id} 
          />
        ))}
      </div> 
    </div>
  );
}

PostsList.Loading = () => {
  return (
    <div className='p-4'>
      <div className='flex flex-col gap-y-5'>
        {Array.from({ length: 2 }).map((i, idx) => (
          <div className='w-full flex gap-4' key={'post-sk' + idx}>
            <Skeleton className='w-[80px] h-[70px] rounded-full' />
            <div className="w-full">
              <Skeleton className='w-[200px] h-2 mb-2 rounded-md' />
              <Skeleton className='w-full h-[120px] rounded-md' />
              <div className="flex gap-2 mt-2">
                <Skeleton className='w-20 h-8 rounded-md' />
                <Skeleton className='w-24 h-8 rounded-md' />
                <Skeleton className='w-28 h-8 rounded-md' />
                <Skeleton className='w-16 h-8 rounded-md' />
              </div>
            </div>
          </div>
        ))}
      </div> 
    </div>
  )
}