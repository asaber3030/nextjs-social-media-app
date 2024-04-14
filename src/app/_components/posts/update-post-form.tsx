"use client";

import { useContext, useState } from "react";
import { useGetUser } from "@/hooks";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Lock, Check, SendHorizonal, File, Smile, Zap } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { create as createNewPostAPI } from "@/actions/post";
import { CreatePostValidator } from "@/schema/auth";
import { Send as SendResponse } from "@/lib/utils";
import { useParams } from "next/navigation";
import { UserItems } from "@/providers/user-items";

interface Props {
  params?: { username: string }
}

export const UpdatePostForm = ({ params }: Props) => {

  const queryClient = useQueryClient()

  const { username }: { username: string } = useParams()
  const { user, isLoading } = useGetUser(username);

  const [postStatus, setPostStatus] = useState(false);
  const [feelingState, setFeelingState] = useState('')
  const [doingState, setDoingState] = useState('')

  const form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(CreatePostValidator)
  })

  const updatePost = useMutation({
    mutationFn: (values: any) => createNewPostAPI(values),
    onSuccess: (data) => {
      if (data.status === SendResponse.codes.created) {
        toast.success("Your post has been published!")
        form.reset()
      } else {
        toast.warning("Couldn't create your post!")
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', ] })

    }
  })

  const togglePostStatus = () => {
    setPostStatus(old => !old)
  }

  const createPostHandler = () => {
    updatePost.mutate({
      content: form.getValues('content'),
      private: postStatus,
      doing: doingState,
      feeling: feelingState,
    })
  }

  if (isLoading) return <UpdatePostForm.Loading />

  return (
    <div className='my-2 pb-0 mb-0'>
      <section className='flex gap-6 mb-4'>
        
        <div className='flex flex-col gap-y-2 w-full'>

          <section>
            
            <div className='flex gap-2 items-center'>
              <h3 className='text-lg font-semibold'>{user?.name}</h3>
              {feelingState ? (
                <div className='text-sm font-normal text-gray-600'>is feeling <span className='text-yellow-50 capitalize'>{feelingState}</span></div>
              ): doingState && (
                <div className='text-sm font-normal text-gray-600'>is doing <span className='text-yellow-50 capitalize'>{doingState}</span></div>
              )}
            </div>

            <Badge variant={postStatus === true ? 'outline' : 'default'} onClick={togglePostStatus} className='rounded-sm cursor-pointer flex gap-1 items-center w-fit select-none'>
              {postStatus === true ? <Lock className='size-3' /> : <Check className='size-3' />}
              {postStatus === true ? "Private" : "Public"}
            </Badge>
          </section>

          <section className="mt-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(createPostHandler)} className='flex flex-col gap-y-2'>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl><Textarea placeholder='What do you think about...?' className='resize-none h-[120px] overflow-hidden rounded-sm' {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-between gap-1'>
                  <section>
                    <LoadingButton
                      loading={createPost.status === 'pending'} 
                      className='w-fit' size='sm'>
                        {createPost.status === 'pending' ? 'Publishing ...' : <><SendHorizonal className='size-5' /> Publish</>}
                    </LoadingButton>
                  </section>
                  <section className='flex gap-1'>
                    <Button size='sm' variant='outline'><File className='size-4' /></Button>
                    <Button size='sm' variant='outline'><Smile className='size-4' /></Button>
                    <Button size='sm' variant='outline'><Zap className='size-4' /></Button>
                  </section>
                </div>
              </form>
            </Form>
          </section>
        </div>
      </section>
    </div>
  );
}
 
UpdatePostForm.Loading = () => {
  return (
    <div className='w-full flex gap-4 mt-8 mb-4'>
      <Skeleton className='w-[80px] h-[70px] rounded-full' />
      <div className="w-full">
        <Skeleton className='w-[200px] h-4 rounded-md' />
        <Skeleton className='w-[80px] h-4 my-2 rounded-md' />
        <Skeleton className='w-full h-[120px] rounded-md' />
        <div className="flex justify-between gap-2 mt-2">
          <Skeleton className='w-24 h-10 rounded-md' />
          <div className='flex gap-1'>
            <Skeleton className='w-10 h-10 rounded-md' />
            <Skeleton className='w-10 h-10 rounded-md' />
            <Skeleton className='w-10 h-10 rounded-md' />
          </div>
        </div>
      </div>
    </div>
  )
}
