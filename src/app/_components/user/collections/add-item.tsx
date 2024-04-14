"use client";

import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/loading-button";

import { Collection } from '@/types';
import { toast } from "sonner";
import { ChangeEvent, useEffect, useState } from "react";
import { DisplayPostFiles } from "../../posts/post-files/display-files";
import { cn } from "@/lib/utils";
import { Plus, Save } from "lucide-react";

export const AddItemForm = ({ collection }: { collection: Collection }) => {

  const [pictures, setPictures] = useState<any>()
  const [picturesDisplay, setPicturesDisplay] = useState<any>();

  const createPostHandler = () => {
    try {
      Array.from(pictures).forEach(async (item) => {
        
        const formData = new FormData();
        
        formData.set('id', collection?.id as any);
        formData.set('picture', pictures)
        formData.set('picture', item as any);
        
        const response = await fetch(`/api/user/collections/${collection.id}`, {
          method: 'POST',
          body: formData
        })
        if (response.ok) {
          setPictures(() => null)
          setPicturesDisplay(() => null)
        }
      })

    } catch(e) {
      toast.message("Failed to attach the files!")
    }
  }

  useEffect(() => {
    const display: string[] = [];
    if (pictures) {
      Array.from(pictures).forEach((item: any) => {
        const objectURL = URL.createObjectURL(item as any)
        display.push(objectURL)
      })
      setPicturesDisplay(display)
    }
  }, [pictures])

  return (
    <div className='mt-4 p-4 pb-2 rounded-md bg-lightBg'>
      <section>
        <h1 className='text-lg font-bold mb-4 border-b pb-2'>Add New Photos</h1>
      </section>

      <section className='mb-4'>
        <Input 
          onChange={(event: ChangeEvent<HTMLInputElement>) => setPictures(event.target?.files)}
          type='file' 
          accept="image/*"
          multiple 
          className='mb-4'
        />
        <DisplayPostFiles pictures={picturesDisplay} />
        <LoadingButton variant='outline' size='sm' onClick={createPostHandler} className={cn('text-white', picturesDisplay?.length > 0 && 'mt-4')}><Plus className='size-4' /> Add Photos</LoadingButton>
      </section>

    </div>
  );
}
