"use client";

import { ChangeEvent, useState } from "react"
import { useUser } from "@/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addReply } from "@/actions/post"

import { Comment } from "@/types"

import { SendHorizonal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Data = {
  reply: string,
  userId: number,
  commentId: number,
  commentOwnerId: number
}

export const WriteReply = ({ comment }: { comment: Comment }) => {

  const [reply, setReply] = useState('')
  
  const { user } = useUser()

  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ reply, commentId, userId, commentOwnerId }: Data) => addReply(reply, commentId, userId, commentOwnerId),
    onSuccess: (data) => {
      setReply(old => '')
      queryClient.invalidateQueries({ queryKey: ['user', 'posts', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', comment.postId, comment.id, 'comments', 'replies'] })
    }
  })

  const handleNewComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ reply, commentId: comment?.id as number, userId: user?.id as number, commentOwnerId: comment.userId })
  }

  return (
    <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleNewComment(event)} className='flex items-center gap-2 mb-2'>
      <Input value={reply} onChange={ (event: ChangeEvent<HTMLInputElement>) => setReply(old => event.target?.value) } placeholder='Reply' className='h-fit' />
      <Button disabled={reply == '' ? true : false}><SendHorizonal /></Button>
    </form>
  )
}