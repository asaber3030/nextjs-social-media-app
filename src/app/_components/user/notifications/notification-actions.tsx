"use client";

import { User } from "@/types"
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { changeAllNotification, deleteAllNotification } from "@/actions/user";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  notificationsLength?: number,
  user: User
}

export const NotificationsActions = ({ notificationsLength, user }: Props) => {

  const qc = useQueryClient()

  console.log({asdasd: user})

  const changeAll = useMutation({
    mutationFn: ({ userId, status }: { userId: number, status: boolean }) => changeAllNotification(userId, status),
    onSuccess: (data) => {
      toast.message(data?.message)
      qc.invalidateQueries({ queryKey: ['user', user?.id, 'notifications'] })
    }
  })

  const deleteAll = useMutation({
    mutationFn: (userId: number) => deleteAllNotification(userId),
    onSuccess: (data) => {
      toast.message(data?.message)
      qc.invalidateQueries({ queryKey: ['user', user?.id , 'notifications'] })
    }
  })

  useEffect(() => {
    if (deleteAll.status === 'pending') {
      toast.message("Deleting all notifications...")
    }
    if (changeAll.status === 'pending') {
      toast.message("Changing notifications status...")
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size='sm'><MoreHorizontal className='size-5' /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {notificationsLength && notificationsLength > 0 ? (
            <>
              <DropdownMenuItem onClick={ () => changeAll.mutate({ userId: user?.id as number, status: true }) }>Mark All As Read</DropdownMenuItem>
              <DropdownMenuItem onClick={ () => changeAll.mutate({ userId: user?.id as number, status: false }) }>Mark All As Unread</DropdownMenuItem>
              <DropdownMenuItem onClick={ () => deleteAll.mutate(user?.id as number) }>Delete All</DropdownMenuItem>
            </>
          ): (
            <div className='text-center text-gray-500 py-4'>No notifications</div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
 