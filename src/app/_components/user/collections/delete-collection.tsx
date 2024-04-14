"use client";

import Image from "next/image";

import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { Collection } from "@/types";
import { Button } from "@/components/ui/button";
import { UserItems } from "@/providers/user-items";

import { deleteCollection } from "@/actions/user";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { Trash } from "lucide-react";

export const DeleteCollection = ({ collection }: { collection: Collection }) => {

  const { user } = useContext(UserItems)
  const router = useRouter()

  const removeMutation = useMutation({
    mutationFn: () => deleteCollection(collection.id),
    onSuccess: (data) =>{
      if (data.status === 200) {
        toast.message("Collection deleted!")
      }
      router.push(`/profile/${user.username}`)
    }
  })

  const removeOne = () => {
    removeMutation.mutate()
  }

  return (
    <section className='mb-4 p-4 rounded-md bg-lightBg'>
      <h1 className='text-lg font-bold border-b pb-2'>Delete Collection</h1>
      <p className='text-gray-400 text-sm mt-2 mb-4'>Note: Once your delete this collection your photos attached to it will be removed forever!</p>
      <div className='grid grid-cols-4 gap-2 justify-start flex-wrap'>
        <Button className='mt-1 w-fit px-4' onClick={removeOne} variant='outline' size='sm'><Trash className='size-4' /> Delete</Button>
      </div>
    </section>
  );
}
 