"use client";

import { ChangeEvent, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/hooks"
import { addComment } from "@/actions/post"

import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Post } from "@/types"

type Data = {
  comment: string,
  userId: number,
  postId: number,
  postOwnerId: number
}

export const WriteComment = ({ post }: { post: Post }) => {

  const { user } = useUser()
  
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ comment, postId, userId, postOwnerId }: Data) => addComment(comment, postId, userId, postOwnerId),
    onSuccess: () => {
      setComment(old => '')
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', post.id, 'comments'] })
    }
  })

  const handleNewComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      comment,
      userId: user?.id as number,
      postId: post.id,
      postOwnerId: post.userId
    });
  }

  return (
    <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleNewComment(event)} className='flex items-center gap-2'>
      <Input 
        onChange={ (event: ChangeEvent<HTMLInputElement>) => setComment(old => event.target?.value) } 
        placeholder='Comment something...' 
        className='h-fit' 
      />
      <Button disabled={comment == '' ? true : false}><SendHorizonal /></Button>
    </form>
  )
}