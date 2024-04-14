"use client";

import Link from "next/link";
import moment from "moment";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MoreHorizontal } from "lucide-react";
import { LoadingButton } from "@/components/loading-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Notification as NotificationType } from "@/types"

import { changeNotification, deleteNotification, getNotifications } from "@/actions/user";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { UserContext } from "@/providers/user";

export const Notification = ({ notification }: { notification: NotificationType }) => {

  const qc = useQueryClient()
  const user = useContext(UserContext)

  const changeOne = useMutation({
    mutationFn: ({ id, status }: { id: number, status: boolean }) => changeNotification(id, status),
    onSuccess: (data) => {
      toast.message(data?.message)
      qc.invalidateQueries({ queryKey: ['user', user?.id, 'notifications'] })
    }
  })

  const deleteOne = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: (data) => {
      toast.message(data?.message)
      qc.invalidateQueries({ queryKey: ['user', user?.id, 'notifications'] })
    }
  })

  useEffect(() => {
    if (deleteOne.status === 'pending') {
      toast.message("Deleting notifications...")
    }
    if (changeOne.status === 'pending') {
      toast.message("Changing notification status...")
    }
  })

  return (
    <div className={cn('bg-lightBg p-4 rounded-md shadow-2xl border border-gray-800/50', !notification.isRead && 'border-l-4 border-l-blue-500')} key={notification.id}>

      <header className='flex justify-between items-center'>
        <div>
          <Link href={notification.url} className='text-sm'>{notification.title}</Link>
          <p className='text-xs text-gray-500 flex items-center gap-1'>{moment(notification.createdAt).fromNow()}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size='sm' className='p-1 px-2'><MoreHorizontal className='size-4' /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup className='gap-2 block'>
              {notification.isRead ? (
                <DropdownMenuItem className='text-white w-full mb-1' onClick={ () => changeOne.mutate({ id: notification.id, status: false }) }>Mark as unread</DropdownMenuItem>
              ): (
                <DropdownMenuItem className='text-white w-full mb-1' onClick={ () => changeOne.mutate({ id: notification.id, status: true }) }>Mark as read</DropdownMenuItem>
              )}
              <DropdownMenuItem className='text-white w-full' onClick={ () => deleteOne.mutate(notification.id) }>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <p className='text-gray-400 text-sm mt-2'>{notification.description}</p>
    </div>
  );
}