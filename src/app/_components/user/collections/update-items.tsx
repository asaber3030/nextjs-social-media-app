"use client";

import Image from "next/image";

import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { Collection, CollectionItem } from "@/types";
import { Button } from "@/components/ui/button";
import { UserItems } from "@/providers/user-items";

import { deleteCollectionItem } from "@/actions/user";
import { revalidate } from "@/actions";
import { toast } from "sonner";
import { EmptyState } from "../empty-list";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RocketIcon } from "lucide-react";

export const UpdateCollectionItems = ({ collection }: { collection: Collection }) => {

  const { user } = useContext(UserItems)

  const removeMutation = useMutation({
    mutationFn: (id: number) => deleteCollectionItem(id),
    onSuccess: (data) =>{
      if (data.status === 200) {
        toast.message("Photo deleted!")
      }
      revalidate(`/profile/${user.username}/collections/${collection.id}`)
    }
  })

  const removeOne = (id: number) => {
    removeMutation.mutate(id)
  }

  return (
    <section className="p-4 rounded-md bg-lightBg">
      <h1 className='text-lg font-bold mb-4 border-b pb-2'>Remove Photo Collection</h1>
      <div className='grid grid-cols-4 gap-2 justify-start flex-wrap'>
        {collection.items?.map((item: CollectionItem, idx: number) => (
          <div key={`collection-item-display-update-${idx}`}>
            <Image 
              src={item.file} 
              alt='Picture display' 
              width={200} 
              height={200}
              className='rounded-md overflow-hidden object-fill w-full h-auto'
            />
            <Button className='w-full mt-1' onClick={ () => removeOne(item.id) } size='sm' variant='filled'>Remove</Button>
          </div>
        ))}
      </div>

      {collection.items.length === 0 && (
        <Alert className='w-full'>
          <RocketIcon className="size-4" />
          <AlertTitle className='font-bold'>No Photos!</AlertTitle>
          <AlertDescription className='text-gray-500'>No Photos added to this collection <b>{collection.title}</b></AlertDescription>
        </Alert>
      )}
    </section>
  );
}
 