"use client";

import { useContext, useEffect, useState } from "react";
import { useGetUser, useUser } from "@/hooks";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { SendHorizonal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { PostFeelingAndDoingStates } from "./post-activity/post-state";
import { UserAvatar } from "../user/avatar";
import { UserDoingSomethingList } from "./post-activity/post-doing";
import { UserFeelingSomethingList } from "./post-activity/post-feeling";
import { PostPrivacyStatus } from "./post-privacy";
import { PostFileSelection } from "./post-files/post-files";

import { Post, User } from "@/types";
import { CreatePostValidator } from "@/schema/auth";
import { Send as SendResponse } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { create as createNewPostAPI } from "@/actions/post";
import { DisplayPostFiles } from "./post-files/display-files";
import { PublishButton } from "./publish-button";
import { UserContext } from "@/providers/user";
import { UserItems } from "@/providers/user-items";

interface Props {
  showImage?: boolean,
  params?: { username: string }
}

export const WritePost = ({ showImage = true }: Props) => {

  const queryClient = useQueryClient()

  const user = useContext(UserContext)

  const [postStatus, setPostStatus] = useState(false);
  const [feelingState, setFeelingState] = useState('')
  const [doingState, setDoingState] = useState('')

  const [pictures, setPictures] = useState<any>()
  const [picturesDisplay, setPicturesDisplay] = useState<any>();

  const form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(CreatePostValidator)
  })

  const createPost = useMutation({
    mutationFn: (values: any) => createNewPostAPI(values),
    onSuccess: (data) => {
      if (data.status === SendResponse.codes.created) {
        toast.success("Your post has been published!")
        const donePost = data?.data;
        if (pictures && pictures?.length) {
          try {
            Array.from(pictures).forEach(async (item) => {
              const formData = new FormData();
              formData.set('id', donePost?.id as any);
              formData.set('picture', pictures)
              formData.set('picture', item as any);
              
              const response = await fetch('/api/post/add-attachments', {
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
        setFeelingState(() => '')
        setDoingState(() => '')
        form.reset()
      } else {
        toast.warning("Couldn't create your post!")
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', user?.id] })
    }
  })

  const togglePostStatus = () => {
    setPostStatus(old => !old)
  }

  const createPostHandler = async () => {
    createPost.mutate({
      content: form.getValues('content'),
      private: postStatus,
      doing: doingState,
      feeling: feelingState,
    })
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
    <div className='my-2 p-4 pb-0 mb-0'>

      <section className='flex gap-6 mb-4'>
        
        {showImage && (
          <div className='xl:min-w-[70px] lg:min-h-[70px] xl:max-w-[130px] lg:max-h-[70px] h-[70px] w-[70px]'>
            <UserAvatar className='size-16' avatarSize='20' user={user as User} />
          </div>
        )}

        <div className='flex flex-col gap-y-2 w-full'>

          <section>
            <div className='flex gap-2 items-center'>
              <h3 className='text-lg font-semibold'>{user?.name}</h3>
              <PostFeelingAndDoingStates feelingState={feelingState} doingState={doingState} />
            </div>
            <PostPrivacyStatus postStatus={postStatus} togglePostStatus={togglePostStatus} />
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
                
                <DisplayPostFiles pictures={picturesDisplay} />
                
                {picturesDisplay?.length > 3 && <div className='my-2 text-red-500'>Max allowed number of pictures = 3!</div>}

                <div className='flex justify-between gap-1'>
                  <section>
                    <PublishButton status={createPost.status} />
                  </section>
                  <section className='flex gap-1'>
                    <PostFileSelection pictures={pictures} setPictures={setPictures} />
                    <UserDoingSomethingList setDoingState={setDoingState} doingState={doingState} />
                    <UserFeelingSomethingList setFeelingState={setFeelingState} feelingState={feelingState} />
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
 
WritePost.Loading = () => {
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
