"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Bookmark } from "lucide-react";

import { Post } from "@/types";

import { toast } from "sonner";
import { hasSaved, save, unsave } from "@/actions/post";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/providers/user";
import { revalidate } from "@/actions";

export const SavePostStatusAction = ({ post }: { isSaved?: boolean, post: Post }) => {

  const qc = useQueryClient()
  const router = useRouter()
  const current = useContext(UserContext)

  const isSavedPostQuery = useQuery({
    queryKey: ['user',  post.id, 'saved'],
    queryFn: ({ queryKey }) => hasSaved(current.id, queryKey[1] as number)
  })

  const saveMutation = useMutation({
    mutationFn: () => save(post?.userId, post?.id, current.id),
    onSuccess: (data) => {
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user',  post.id, 'saved'] })
      toast.message(data?.message)
      router.refresh()
    },
    onError: (e) => console.log(e)
  })
  const unsaveMutation = useMutation({
    mutationFn: () => unsave(post?.id, current.id),
    onSuccess: (data) => {
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user',  post.id, 'saved'] })
      toast.message(data?.message)
      router.refresh()
    },
    onError: (e) => console.log(e)
  })

  const saveAction = () => {
    saveMutation.mutate()
  }

  const unsaveAction = () => {
    unsaveMutation.mutate()
  }

  return (
    <>
      {isSavedPostQuery.data ? (
        <DropdownMenuItem onClick={unsaveAction}><Bookmark fill="white" className='size-5 mr-4' /> Unsave</DropdownMenuItem>
      ): (
        <DropdownMenuItem onClick={saveAction}><Bookmark className='size-5 mr-4' /> Save</DropdownMenuItem>
      )}
    </>
  );
}