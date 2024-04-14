"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/loading-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserUpload } from "@/types";

import { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";

import { changePictureFromExistingFile, getUserUploads } from "@/actions/user";
import { toast } from 'sonner';

export const EditPictureComponent = () => {

  const { user, isLoading } = useUser()

  const [picture, setPicture] = useState<File>()
  const [loading, setLoading] = useState(false)
  const [tempImage, setTempImage] = useState('/defaults/user-svg.svg')

  const uploadsQuery = useQuery({
    queryKey: ['user', 'uploads'],
    queryFn: () => getUserUploads()
  })
  const changeMutation = useMutation({
    mutationFn: (file: string) => changePictureFromExistingFile(file, user?.id as number),
    onSuccess: (data) => {
      toast.success(data.message)
    }
  })

  const onChoose = (file: string, id: number) => {
    changeMutation.mutate(file)
  }
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPicture(e.target.files?.[0])
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    if (!picture) {
      toast.message("Please provide a picture")
      return
    } else if (picture.size >= 5000000) {
      toast.message("Max File Size is 5MB")
      return
    } else if (!['image/jpg', 'image/jpeg', 'image/svg', 'image/png', 'image/gif'].includes(picture.type)) {
      toast.message("Uploaded file is not allowed!")
      return
    }

    try {
      setLoading(true)
      const data = new FormData()
      data.set('id', user?.id as any)
      data.set('picture', picture)
      const response = await fetch('/api/user/change-picture', {
        method: 'POST',
        body: data
      }).then(
        data => {
          setLoading(false)
          return data
        }
      ).catch(error => {
        console.log(error)
        return error
      }).finally(() => {
        setLoading(false)
      })
      if (response.ok) {
        toast.success('Profile picture changed!')
        setTempImage(old => '/defaults/user-svg.svg')
        uploadsQuery.refetch()
      }
      if (!response.ok) throw new Error('Error')
    } catch (e: any) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (picture) {
      if (['image/jpg', 'image/jpeg', 'image/png', 'image/svg', 'image/gif'].includes(picture.type)) {
        const objectURLPreview = URL.createObjectURL(picture as any)
        setTempImage(old => objectURLPreview)
      }
    }
  }, [picture])

  if (isLoading) return <div>Loading</div>

  return (
    <div>
      <h3 className='text-2xl text-center font-bold mb-4 p-4  rounded-md shadow-lg'>Edit Picture</h3>

      <section>
        <form onSubmit={onSubmit} className='mb-5'>
          <h4 className='font-bold'>Choose a new picture</h4>
          <Separator className='my-1 mb-4' />
          <Image className='object-contain my-4 rounded-md' alt='User' src={tempImage} width={150} height={150} />
          <Input onChange={onChange} type='file' />
          <LoadingButton loading={loading} type='submit' className='w-fit mt-2' variant='blue'>Update profile</LoadingButton>
        </form>
      </section>

      <section>
        <h4 className='font-bold'>Choose an existing picture</h4>
        <Separator className='my-1' />

        {uploadsQuery.isLoading ? (
          <EditPictureComponent.ImagesLoading />
        ): (
          <div className='grid xl:grid-cols-6 gap-2'>
            {uploadsQuery.data?.map((upload: UserUpload) => (
              <div key={upload.id} className='min-h-[200px] max-h-[400px] bg-gray-800 flex justify-between flex-col p-2 rounded-md'>
                <Image alt='User' width={150} height={150} src={upload.file} className='rounded-md max-h-[100%] mx-auto my-auto' />
                <Button variant='secondary' className='w-full mt-2' size='sm' onClick={() => onChoose(upload.file, upload.id)}>Choose</Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

EditPictureComponent.ImagesLoading = () => {
  return (
    <div className='grid grid-cols-6 gap-2'>
      <Skeleton className='h-[300px] rounded-md' />
      <Skeleton className='h-[300px] rounded-md' />
      <Skeleton className='h-[300px] rounded-md' />
      <Skeleton className='h-[300px] rounded-md' />
      <Skeleton className='h-[300px] rounded-md' />
      <Skeleton className='h-[300px] rounded-md' />
    </div>
  )
}
 