"use client";

import React, { useContext, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useInView } from 'react-intersection-observer'

import { getUserFeed } from "@/actions/user";

import { Post } from "@/types";
import { SinglePost } from "./posts/post";
import { UserContext } from "@/providers/user";
import { PostSkeleton } from "./skeleton/post-loading-skeleton";

export const HomeFeed = () => {

  const { inView, ref } = useInView()

  const user = useContext(UserContext)

  const { data, fetchNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['user', 'posts', user?.id],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getUserFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage
  })

  console.log(data?.pages)

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div>
      {data?.pages.map((page, idx) => (
        <React.Fragment key={`page-feed-idx-${idx}`}>
          {page?.posts?.map((post) => (
            <SinglePost
              key={`feed-single-post-${post.id}`}
              post={post as unknown as Post}
            />
          ))}
        </React.Fragment>
      ))}

      {isFetching && (
        <div className='my-4'>
          <PostSkeleton />
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}