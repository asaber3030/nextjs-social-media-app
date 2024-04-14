"use client";

import Image from "next/image";
import Link from "next/link";

import { notFound, useParams } from "next/navigation";
import { useGetUser } from "@/hooks";

import { picture } from "@/lib/images";
import { route } from "@/lib";

import { Skeleton } from "@/components/ui/skeleton";

export const PrivateUserComponent = () => {

  const { username }: { username: string } = useParams()
  const { user, isLoading } = useGetUser(username)

  if (isLoading) return <PrivateUserComponent.Loading />

  if (!user) return notFound()

  return (
    <div>
      <header className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Followers List</h2>
        <Link href={route('profile', username)} className='text-sm text-gray-500 hover:underline'>@{username}</Link>
      </header>

      <section>
        <Image src={picture('private')} alt='User' width={100} height={100} />
        <h3>{user?.name} / {username}</h3>
      </section>
    </div>
  )
}

PrivateUserComponent.Loading = () => {
  return (
    <div>
      <header className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>Followers List</h2>
        <Skeleton className='w-[100px] h-4' />
      </header>

      <section>
        <Skeleton className='w-full h-36' />
      </section>
    </div>
  )
}