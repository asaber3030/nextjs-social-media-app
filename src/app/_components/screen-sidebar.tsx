"use client";

import { UserContext } from "@/providers/user";
import { Activity, Bell, Cog, Home, LogOut, MessageCircle, PlusSquare, Search, User, Users, Video } from "lucide-react"

import Link from "next/link"
import { useContext } from "react";
import LogoutButton from "./authentication/logout-button";

export const ScreenSidebar = () => {

  const current = useContext(UserContext)

  return (
    <aside className='hidden w-[300px] h-fit lg:block pr-2'>
      <Link href='/' className='p-2 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-gray-800 mb-2 text-gray-400 text-sm'><Home /> Home</Link>
      <Link href='/search' className='p-2 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-gray-800 mb-2 text-gray-400 text-sm'><Search /> Search</Link>
      <Link href={`/profile/${current.username}`} className='p-2 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-gray-800 mb-2 text-gray-400 text-sm'><User /> Profile</Link>
      <Link href={'/notifications'} className='p-2 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-gray-800 mb-2 text-gray-400 text-sm'><Bell /> Notifications</Link>
      <Link href={`/profile/${current.username}/settings`} className='p-2 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-gray-800 mb-2 text-gray-400 text-sm'><Cog /> Settings</Link>
      <Link href={`/activities`} className='p-2 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-gray-800 mb-2 text-gray-400 text-sm'><Activity /> Activity</Link>
      <LogoutButton>
        <Link href='/login' className='p-2 mb-0 px-4 transition-all rounded-md flex gap-4 items-center hover:bg-red-800/10 font-bold text-red-800 text-sm'><LogOut /> Logout</Link>
      </LogoutButton>
    </aside>
  )
}