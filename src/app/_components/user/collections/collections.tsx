"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getCollections } from "@/actions/user";

import { Collection } from "@/types";
import { UserItems } from "@/providers/user-items";

import { OneCollection } from "./one-collection";
import { Carousel } from 'react-responsive-carousel';
import { Skeleton } from "@/components/ui/skeleton";

export const UserCollections = () => {

  const { user } = useContext(UserItems)

  const queryCollection = useQuery({
    queryKey: ['user', user?.id, 'collections'],
    queryFn: () => getCollections(user?.id)
  })

  const collections: Collection[] = queryCollection.data?.data

  if (queryCollection.isLoading) return <UserCollections.Loading />

  return (
    <div className='mt-4'>
      <Carousel
        centerMode
        centerSlidePercentage={30}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
      >
        {collections.map((collection) => (
          <OneCollection collection={collection} key={`collection-idx-${collection.id}`} />
        ))}
      </Carousel>
    </div>
  );
}

UserCollections.Empty = () => {
  return (
    <div>
      Empty collections
    </div>
  )
}

UserCollections.Loading = () => {
  return (
    <div className='grid xl:grid-cols-4 sm:grid-cols-2 gap-2 mt-4'>
      {Array.from({ length: 4 }).map((_, idx) => (
        <Skeleton key={`loading-collections-idx-${idx}`} className="w-full h-[400px]" />
      ))}
    </div>
  )
}