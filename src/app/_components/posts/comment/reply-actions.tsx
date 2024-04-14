"use client";

import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteReply, updateReply } from "@/actions/post";
import { toast } from "sonner";

import { CommentReply } from "@/types";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/providers/user";

export const ReplyActions = ({ reply, postId }: { reply: CommentReply, postId: number }) => {

  const current = useContext(UserContext)
  const qc = useQueryClient()

  const [updatedContent, setUpdatedContent] = useState(reply.reply)

  const deleteReplyMutation = useMutation({
    mutationFn: () => deleteReply(reply.id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['user', postId, reply.commentId, 'comments', 'replies'] })
      if (data.status == 200) {
        toast.success("Reply Deleted")
      } else {
        toast.warning("Couldn't delete reply")
      }
    }
  })

  const updateReplyMutation = useMutation({
    mutationFn: (value: string) => updateReply(reply.id, value),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['user', postId, reply.commentId, 'comments', 'replies'] })
      if (data.status == 200) {
        toast.success("Reply Updated!")
      } else {
        toast.warning("Couldn't update Reply")
      }
    }
  })
  
  const deleteHandler = () => {
    deleteReplyMutation.mutate()
  }
  const updateHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateReplyMutation.mutate(updatedContent)
  }

  if (current?.id !== reply.userId) return null

  return (
    <DropdownMenu>
      
      <DropdownMenuTrigger><Button variant='ghost' size='sm' className='p-2 h-8 text-xs bg-transparent border-none'><MoreHorizontal className='size-4' /></Button></DropdownMenuTrigger>

      <DropdownMenuContent>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className='h-8 w-full bg-transparent text-white hover:bg-transparent'>Edit</Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Reply</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={updateHandler}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Reply</Label>
                  <Input id="name" value={updatedContent} onChange={ (event: ChangeEvent<HTMLInputElement>) => setUpdatedContent(event.target.value) } className="col-span-3" />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>

          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className='h-8 w-full bg-transparent text-white' variant='destructive'>Delete</Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Reply</DialogTitle>
              <DialogDescription>Are you sure that you want to delete this Reply? This action cannot be reversed at anytime after committing.</DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button onClick={deleteHandler} type="submit" variant='destructive'>Delete</Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}
 