"use client";

import { useQuery } from "@tanstack/react-query";

import { Separator } from "@/components/ui/separator";
import { UserItems } from "@/providers/user-items";
import { NotificationsActions } from "./notification-actions";
import { Notification as NotificationType } from "@/types"
import { EmptyState } from "../empty-list";
import { Notification } from "./one-notification";

import { getNotifications } from "@/actions/user";
import { useContext } from "react";
import { NotificationSkeleton } from "../../skeleton/notification-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/providers/user";
import Link from "next/link";

export const NotificationsComponent = () => {

  const user = useContext(UserContext)

  const notificationsQuery = useQuery({ 
    queryKey: ['user', user?.id, 'notifications'],
    queryFn: () => getNotifications(),
  })

  const notifications: NotificationType[] = notificationsQuery.data?.notifications as any
  
  if (notificationsQuery.isLoading) return <NotificationsComponent.Loading />

  return (
    <div className="mb-4">
      <header className='flex items-center justify-between'>
        <Link href='/notifications' className='text-xl font-semibold'>Notifications</Link>
        <NotificationsActions notificationsLength={notifications.length} user={user} />
      </header>
      <Separator className='my-2' />

      {notifications?.length === 0 ? (
       <NotificationsComponent.Empty />
      ): (
        <div className='flex flex-col gap-y-2'>
          {notifications?.map((notification: NotificationType) => (
            <Notification
              key={`notification-idx-${notification.id}`}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  )
}

NotificationsComponent.Loading = () => {
  return (
    <div className='flex flex-col gap-y-3 divide-y'>
      <header className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Notifications</h2>
        <Skeleton className='w-8 h-8' />
      </header>
      {Array.from({ length: 6 }).map((item) => (
        <NotificationSkeleton key={`loading-notification-skeleton-idx-${item}`} />
      ))}
    </div>
  )
}

NotificationsComponent.Empty = () => {
  return (
    <div>
      <EmptyState title='No Notifications' />
    </div>
  )
}