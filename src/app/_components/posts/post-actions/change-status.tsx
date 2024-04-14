"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Lock } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePostStatus } from "@/actions/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserItems } from "@/providers/user-items";
import { revalidate } from "@/actions";

export const ChangePostStatusAction = ({ isPrivate, postId }: { isPrivate: boolean, postId: number }) => {

  const qc = useQueryClient()
  const router = useRouter()

  const { current } = useContext(UserItems)

  const postMutation = useMutation({
    mutationFn: () => changePostStatus(postId, isPrivate ? false : true),
    onSuccess: (data) => {
      revalidate(`/profile/${current.username}`)
      qc.invalidateQueries({ queryKey: ['user', 'posts', current?.id] })
      toast.message(data?.message)
      router.refresh()
    }
  })

  const changeStatusAction = () => {
    postMutation.mutate()
  }

  return (
    <DropdownMenuItem onClick={changeStatusAction}><Lock className='size-5 mr-4' /> Make {isPrivate ? 'Public' : 'Private'}?</DropdownMenuItem>
  )
}