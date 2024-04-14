"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { File } from "lucide-react"
import { ChangeEvent } from "react";

interface Props {
  pictures: FileList | undefined,
  setPictures: any
}

export const PostFileSelection = ({ setPictures }: Props) => {
  return (
    <div className='relative'>
      <Input
        onChange={(event: ChangeEvent<HTMLInputElement>) => setPictures(event.target?.files)}
        accept="image/*"
        multiple
        type='file'
        className='opacity-0 absolute w-[100%] h-[100%] top-0 left-0 cursor-pointer'
      />
      <Button size='sm' variant='outline'><File className='size-4' /></Button>
    </div>
  )
}