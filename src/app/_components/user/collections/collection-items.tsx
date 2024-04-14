"use client";

import moment from "moment";
import Link from "next/link";

import { Collection, CollectionItem } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { OneCollectionItem } from "./one-collection-item";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

import React, { useContext, useState } from "react";
import { UserItems } from "@/providers/user-items";

export const CollectionItems = ({ collection, items, children }: { collection: Collection, items: CollectionItem[] , children: React.ReactNode }) => {
  
  const { current, user } = useContext(UserItems)

  const [currentActive, setActive] = useState(0)
  
  function nextImage(): void {
    setActive(old => currentActive === items.length - 1 ? 0 : old + 1)
  }

  function previousImage(): void {
    setActive(old => currentActive === 0 ? items.length - 1 : old - 1)
  }

  return (
    <Dialog>

      <DialogTrigger asChild>{children}</DialogTrigger>
      
      <DialogContent className='min-w-[400px] min-h-[400px] h-[880px] p-0'>

        <section className="relative min-h-full">

          {items.map((item, idx) => {
            if (idx === currentActive) {
              return (
                <div className='relative h-full'>
                  <OneCollectionItem item={item} key={`collection-item-photo-idx-${item.id}`} />
                  <div className='absolute bg-black text-xs rounded-md z-[10000] m-4 p-2 text-gray-400'>{moment(item.createdAt).fromNow()}</div>
                </div>
              )
            }
            return null
          })}

          {items.length > 0 && (
            <React.Fragment>
              <Button className='absolute -right-5 top-1/2 rounded-full' onClick={nextImage}><ChevronRight /></Button>
              <Button className='absolute -left-5 top-1/2 rounded-full' onClick={previousImage}><ChevronLeft /></Button>
            </React.Fragment>
          )}

          <section className="absolute bg-lightBg w-full p-4 z-[100000] bottom-0">
            <h1 className='font-bold text-lg'>{collection.title}</h1>
            <p className='text-gray-500 text-sm'>{moment(collection.createdAt).fromNow()}</p>
            {user?.id === current?.id && (
              <div className='flex justify-end'>
                <Link href={`/profile/${user?.username}/collections/${collection.id}`}><Button size='sm' className='px-4'><ImageIcon className='size-4' /> Update Collection</Button></Link>
              </div>
            )}
          </section>
        </section>

      </DialogContent>

    </Dialog>
  );
}