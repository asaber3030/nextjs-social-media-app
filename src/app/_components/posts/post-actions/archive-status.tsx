"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Bookmark, Loader } from "lucide-react";
import { UserItems } from "@/providers/user-items";

import { Post } from "@/types";

import { toast } from "sonner";
import { archive, hasArchived } from "@/actions/post";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidate } from "@/actions";

export const ArchivePostStatus = ({ isArchived, post }: { isArchived?: boolean, post: Post }) => {

  const router = useRouter()
  const qc = useQueryClient()

  const { current } = useContext(UserItems)

  const isPostArchived = useQuery({
    queryKey: ['user', post.id, 'archived'],
    queryFn: () => hasArchived(current.id, post.id)
  })

  const archiveMutation = useMutation({
    mutationFn: () => archive(post?.id, true),
    onSuccess: (data) => {
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user', post.id, 'archived'] })
      toast.message(data?.message)
      router.refresh()
    }
  })
  const unarchiveMutation = useMutation({
    mutationFn: () => archive(post?.id, false),
    onSuccess: (data) => {
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user', post.id, 'archived'] })
      toast.message(data?.message)
      router.refresh()
    }
  })

  const archiveAction = () => {
    archiveMutation.mutate()
  }

  const unarchiveAction = () => {
    unarchiveMutation.mutate()
  }

  return (
    <>
      {isPostArchived.data ? (
        <DropdownMenuItem 
          disabled={unarchiveMutation.status === 'pending'} 
          onClick={unarchiveAction}>
            {unarchiveMutation.status === 'pending' && <Loader className='size-5 mr-2 animate-spin' />}
            <Bookmark fill="white" className='size-5 mr-4' /> 
            Un archive
          </DropdownMenuItem>
      ): (
        <DropdownMenuItem 
          disabled={archiveMutation.status === 'pending'} 
          onClick={archiveAction}>
            {unarchiveMutation.status === 'pending' && <Loader className='animate-spin' />}
            <Bookmark fill="white" className='size-5 mr-4' /> 
            Archive
          </DropdownMenuItem>
      )}
    </>
  );
}