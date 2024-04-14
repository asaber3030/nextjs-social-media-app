"use client";

import moment from 'moment'
import Link from "next/link"

import { useQuery } from "@tanstack/react-query"
import { useContext, useState } from 'react';
import { route } from '@/lib';
import { getPostComments, hasSaved } from '@/actions/post';

import { Comment, Post, User } from "@/types"

import { Lock, MessageCircle } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton';
import { PostButton } from "./post-button"
import { PostActions } from "./post-actions/post-actions"
import { PostComments } from './comment/post-comments';
import { UserAvatar } from '../user/avatar';
import { PostFeelingAndDoingStates } from './post-activity/post-state';
import { PostAttachments } from './post-attachements/post-attachments-view';
import { LikePostActions } from './post-actions/like-post';
import { UserItems } from '@/providers/user-items';

interface Props {
  post: Post,
  showBottomAction?: boolean,
  showComments?: boolean
}

export const SinglePost = ({ post, showComments, showBottomAction = true }: Props) => {

  const { user, current } = useContext(UserItems)
  const [commentsStatus, setCommentsStatus] = useState(showComments)

  const postComments = useQuery({
    queryKey: ['user', post.id, 'comments'],
    queryFn: ({ queryKey }) => getPostComments(queryKey[1] as number),
    enabled: !!commentsStatus
  })
  
  const comments: Comment[] = postComments.data?.data

  const hasSaveQuery = useQuery({
    queryKey: ['user', current.id, post.id, 'saved'],
    queryFn: ({ queryKey }) => hasSaved(queryKey[1] as number, queryKey[2] as number)
  })

  if (post.private && user?.id !== current?.id) return null

  return (
    <div className='p-4'>

      <section className='flex gap-6'>

        <div className='xl:min-w-[70px] lg:min-h-[70px] xl:max-w-[130px] lg:max-h-[70px] h-[70px] w-[70px]'>
          <UserAvatar className='size-16' avatarSize='20' user={post?.user as User} />
        </div>

        <section className='w-full'>

          <section className='mb-3'>
            <div className='flex justify-between items-center'>
              <div className='text-lg text-gray-300 leading-2 flex items-center gap-2'>
                <div className='font-bold mb-0 text-lg text-gray-300 flex items-center gap-1'>
                  <Link className='hover:underline' href={`/profile/${user?.username}`}>{post.user?.name}</Link>
                  <PostFeelingAndDoingStates feelingState={post?.feeling as string} doingState={post?.doing as string} />
                </div>
                {post?.private && <Lock className='ml-4 size-4' />}
              </div>
              <PostActions isSaved={hasSaveQuery?.data} post={post} />
            </div>
            
            <Link className='hover:underline mt-0 p-0' href={route('viewPost', post?.id)}><span className='text-xs text-gray-400'>{moment(post.createdAt).fromNow()}</span></Link>
          </section>
          
          {/* Post Content */}
          <section className='bg-lightBg p-4 pb-1 rounded-md shadow-lg'>
            
            {/* Post Content */}
            <section>
              <p className='p-0 text-sm text-gray-400'>{post.content}</p>
            </section>

            {/* Post Attachments */}
            <PostAttachments post={post} attachments={post.attachments} />

          </section>


          {/* Like - Comment - Save - Share - [Buttons] */}
          {showBottomAction && (
            <section className='flex gap-2 mt-2'>
              <LikePostActions post={post} />
              <PostButton
                className={commentsStatus ? 'bg-hover text-white' : 'bg-transparent'}
                label='Comment'
                variant='outline'
                icon={MessageCircle}
                onClick={() => setCommentsStatus(old => !old)}
                number={post._count.comments}
              />
            </section>
          )}

          {/* Comments loading */}
          {postComments.isLoading && (
            <SinglePost.CommentsLoading />
          )}

          {/* Comments Display */}
          {commentsStatus && !postComments.isLoading && postComments.isFetched && (
            <PostComments comments={comments} post={post} />
          )}
        </section>

      </section>

    </div>
  )
}

SinglePost.CommentsLoading = () => {
  return (
    <div className='flex gap-8 mt-4'>
      <Skeleton className='size-[60px] w-[70px] rounded-full' />
      <div className='flex flex-col gap-y-2 w-full'>
        <Skeleton className='w-[150px] h-2' />
        <Skeleton className='w-[100px] h-2' />
        <Skeleton className='w-full h-[80px]' />
        <div className='flex items-center gap-2'>
          <Skeleton className='w-[80px] h-2' />
          <Skeleton className='w-[120px] h-2' />
        </div>
      </div>
    </div>
  )
}