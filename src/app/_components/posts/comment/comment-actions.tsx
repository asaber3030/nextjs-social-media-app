"use client";

import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment, updateComment } from "@/actions/post";
import { toast } from "sonner";

import { Comment } from "@/types";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/providers/user";

export const CommentActions = ({ comment }: { comment: Comment }) => {

  const current = useContext(UserContext)
  const qc = useQueryClient()

  const [updatedContent, setUpdatedContent] = useState(comment.comment)

  const deleteCommentMutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['user', comment.postId, 'comments'] })
      if (data.status == 200) {
        toast.success("Comment Deleted")
      } else {
        toast.warning("Couldn't delete comment")
      }
    }
  })

  const updateCommentMutation = useMutation({
    mutationFn: (value: string) => updateComment(comment.id, value),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['user', comment.postId, 'comments'] })
      if (data.status == 200) {
        toast.success("Comment Updated!")
      } else {
        toast.warning("Couldn't update comment")
      }
    }
  })
  
  const deleteHandler = () => {
    deleteCommentMutation.mutate()
  }
  const updateHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateCommentMutation.mutate(updatedContent)
  }

  if (current?.id !== comment.userId) return null

  return (
    <DropdownMenu>
      
      <DropdownMenuTrigger><Button variant='ghost' size='sm' className='p-2 h-8 text-xs bg-transparent border-none'><MoreHorizontal className='size-4' /></Button></DropdownMenuTrigger>

      <DropdownMenuContent>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className='h-8 w-full bg-transparent text-white'>Edit</Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Comment</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={updateHandler}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Comment</Label>
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
              <DialogTitle>Delete Comment</DialogTitle>
              <DialogDescription>Are you sure that you want to delete this comment? This action cannot be reversed at anytime after committing.</DialogDescription>
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
 