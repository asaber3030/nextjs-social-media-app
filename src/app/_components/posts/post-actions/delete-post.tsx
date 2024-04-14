"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button";
import { Redo2, Trash } from "lucide-react";

import { UserItems } from "@/providers/user-items";
import { Post } from "@/types";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { forceDelete, restorePost, trashPost } from "@/actions/post";

import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/providers/user";
import { revalidate } from "@/actions";

interface Props {
  post: Post,
}

export const DeletePostAction = ({ post }: Props) => {

  const current = useContext(UserContext)
  const qc = useQueryClient()

  const trashMutation = useMutation({
    mutationFn: () => trashPost(post?.id),
    onSuccess: (data) => {
      if (data?.message) {
        toast.message(data?.message)
      }
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id, 'trashed'] })
    }
  })

  const forceDeleteMutation = useMutation({
    mutationFn: () => forceDelete(post?.id),
    onSuccess: (data) => {
      if (data?.message) {
        toast.message(data?.message)
      }
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id, 'trashed'] })
    }
  })

  const restoreMutation = useMutation({
    mutationFn: () => restorePost(post?.id),
    onSuccess: (data) => {
      if (data?.message) {
        toast.message(data?.message)
      }
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id, 'trashed'] })
    }
  })

  const moveToTrashAction = () => {
    trashMutation.mutate()
  }

  const forceDeleteAction = () => {
    forceDeleteMutation.mutate()
  }

  const restoreAction = () => {
    restoreMutation.mutate()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          className='px-2 py-0 bg-transparent text-white w-full mx-0 text-left flex justify-start'
        >
          {post?.trashed ? <Redo2 className='size-5 mr-1.5' /> : <Trash className='size-5 mr-1.5' />}
          {post?.trashed ? "Restore" : "Delete"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className='min-w-[40%]'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-left'>Are you sure you want to delete this post? <b>#{post.id}</b></AlertDialogTitle>
          <AlertDialogDescription className='text-left'>You can restore the deleted post from trashed section in profile, or you can force delete the post from now!</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className='m-0'>Cancel</AlertDialogCancel>
          {/* Force Delete Action */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className={cn(buttonVariants({ variant: 'outline' }), 'text-white')}>Force Delete</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] min-w-[30%]">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This changes cannot be reversed once you delete this post, it will be deleted forever!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose><Button variant='outline'>Cancel</Button></DialogClose>
                <Button variant='destructive' onClick={forceDeleteAction}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {post?.trashed ? (
            <AlertDialogAction onClick={restoreAction} className={cn(buttonVariants({ variant: 'outline' }), 'text-white')}>Restore</AlertDialogAction>
          ): (
            <AlertDialogAction onClick={moveToTrashAction} className={cn(buttonVariants({ variant: 'outline' }), 'text-white')}>Add to trash</AlertDialogAction>
          )}
          
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}