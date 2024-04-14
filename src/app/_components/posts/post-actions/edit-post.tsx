"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Lock } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { WritePost } from "../write-post";

interface Props {
  post: Post,
}

export const UpdatePostAction = ({ post }: Props) => {

  const qc = useQueryClient()
  const router = useRouter()

  const updatePostAction = () => {
  }

  return (
    <AlertDialog>
      
      <AlertDialogTrigger asChild>
        <Button className='px-2 py-0 bg-transparent text-white w-full mx-0 text-left flex justify-start'><Lock className='size-5 mr-1.5' /> Update Post</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="min-w-[60%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Update post: #{post.id}</AlertDialogTitle>
        </AlertDialogHeader>

        <section>
          <WritePost showImage={false} />
        </section>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}