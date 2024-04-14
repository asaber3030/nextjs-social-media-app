"use client";

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useInView } from 'react-intersection-observer'

import { getUsersPagination } from "@/actions/user";

import { User } from "@/types";
import { SearchInput } from "./search-input";
import { FilteredUsers } from "./filtered-users";
import { UserLongSkeleton } from "../skeleton/user-skeleton";

export const SearchUsers = ({ current }: { current: User }) => {
  
  const { inView, ref } = useInView()

  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  const page = parseInt(searchParams.get('page') as string ?? 1)

  const [value, changeValue] = useState(filter ?? '')

  const { data, fetchNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['users', 'search', filter],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1, queryKey }) => getUsersPagination(queryKey[2], pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div className='mb-[100px]'>

      <SearchInput page={page} value={value} changeValue={changeValue} className="mb-4" />
      
      {data?.pages.map((page, idx) => (
        <React.Fragment key={'page-content-loader-' + idx}>
          <FilteredUsers users={page.users} current={current} isFetching={isFetching} />
        </React.Fragment>
      ))}
     
      <div ref={ref}></div>

      {isFetchingNextPage && (
        <div className='my-4'>
          <UserLongSkeleton />
        </div>
      )}
    </div>
  );
}