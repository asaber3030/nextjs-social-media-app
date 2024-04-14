"use client";

import Image from "next/image";

import { Collection } from "@/types";
import { CollectionItems } from "./collection-items";
import Link from "next/link";
import { useContext } from "react";
import { UserItems } from "@/providers/user-items";

interface Props {
  collection: Collection
}

export const OneCollection = ({ collection }: Props) => {

  const { user } = useContext(UserItems)

  if (collection.items.length === 0) {
    return (
      <Link href={`/profile/${user?.username}/collections/${collection.id}`} className='bg-lightBg rounded-md min-h-[400px] hover:bg-lightBg/50 transition-colors h-[400px] mr-2 flex items-center justify-center font-bold line-clamp-1'>
        {collection.title}
      </Link>
    );
  }

  return (
    <CollectionItems collection={collection} items={collection.items}>
      <div className='bg-lightBg rounded-md overflow-hidden min-h-[400px] mr-2 h-[400px] flex items-end justify-center font-bold line-clamp-1 relative cursor-pointer'>
        <div className='bg-black opacity-70 absolute w-full h-full left-0 top-0 z-[9] hover:opacity-50 transition-opacity' />
        <Image 
          alt='Item'
          width={0}
          height={0}
          layout="fill"
          sizes="100vw"
          src={collection.items[0].file}
          className='h-auto w-full object-contain hover:bg-blend-darken rounded-md backdrop-brightness-50'
        />
        <h2 className='z-[10] text-white font-normal text-lg mb-5'>{collection.title}</h2>
      </div>
    </CollectionItems>
  )
  
}
 