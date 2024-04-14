"use client";

import moment from "moment";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Comment, Post, PostAttachment } from "@/types";
import { Attachment } from "./one-attachment";
import { Button } from "@/components/ui/button";
import { PostComments } from "../comment/post-comments";
import { EmptyPosts } from "../empty-posts";

import { getPostComments } from "@/actions/post";
import { showS } from "@/lib/utils";
import { route } from "@/lib";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  post: Post,
  file: PostAttachment,
  attachments: PostAttachment[],
}

export const AttachmentModal = ({ attachments, post, file }: Props) => {

  const postComments = useQuery({
    queryKey: ['user', post.id, 'comments'],
    queryFn: () => getPostComments(post.id),
  })

  const comments: Comment[] = postComments.data?.data
  const length = attachments.length

  const [currentActive, setActive] = useState(0)

  const nextImage = () => {
    setActive(old => currentActive === length - 1 ? 0 : old + 1)
  }
  const previousImage = () => {
    setActive(old => currentActive === 0 ? length - 1 : old - 1)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-fit h-full hover:bg-transparent bg-transparent p-0 m-0 block'><Attachment file={file} /></Button>
      </DialogTrigger>

      <DialogContent className="min-w-full w-full h-full min-h-full p-0">
        <div className="grid grid-cols-8 rounded-md">
          <div className="col-span-5 shadow-lg relative border-r flex justify-center w-[70%] mx-auto">
            {attachments?.map((attachment, idx) => {
              if (currentActive === idx) {
                return (
                  <div key={`att-modal-idx-${attachment.id}`}>
                    <Image
                      alt='Post attached image'
                      className='object-cover h-full w-full'
                      layout="fill"
                      src={attachment.path}
                    />
                  </div>
                )
              } else {
                return null
              }
            })}
            <div className='absolute w-full h-full'>
              <Button className='absolute -right-8 top-1/2 rounded-full' onClick={nextImage}><ChevronRight /></Button>
              <Button className='absolute -left-8 top-1/2 rounded-full' onClick={previousImage}><ChevronLeft /></Button>
            </div>
          </div>

          <div className='w-full px-8 col-span-3 py-4'>
            <h3 className="font-bold flex gap-2 text-lg items-center">Comments <span className='text-sm text-gray-400 font-normal'>({comments?.length ?? 0} {showS('comment', comments?.length ?? 0) ?? ""})</span></h3>
            <Link href={route('viewPost', post?.id)} className='text-gray-500 text-xs hover:underline'>Posted {moment(post?.createdAt).fromNow()}</Link>
            <p className='leading-4 text-sm text-gray-400 my-2'>{post?.content}</p>
            
            <div className="overflow-y-auto max-h-[700px]">
              {comments?.length == 0 ? (
                <div className='text-center'>
                  <EmptyPosts label='Be the first to comment in this post!' />
                </div>
              ): (
                <PostComments comments={comments} post={post} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
 