"use client";

import Link from "next/link"
import Image from "next/image"

import { Home, MessageCircle, PlusSquare, Search, Video } from "lucide-react"
import { useUser } from "@/hooks";

export const MobileNavigator = () => {
  
  const { user, isLoading } = useUser()

  return (
    <div className='w-full fixed bottom-0 left-0 xl:hidden lg:hidden bg-black'>
      <div className='flex gap-4 justify-between'>
        <Link className='block p-4 hover:bg-gray-800 transition-all' href='/'><Home className='size-7' /></Link>
        <Link className='block p-4 hover:bg-gray-800 transition-all' href='/'><Video className='size-7' /></Link>
        <Link className='block p-4 hover:bg-gray-800 transition-all' href='/'><Search className='size-7' /></Link>
        <Link className='block p-4 hover:bg-gray-800 transition-all' href='/'><PlusSquare className='size-7' /></Link>
        <Link className='block p-4 hover:bg-gray-800 transition-all' href='/'><MessageCircle className='size-7' /></Link>
        <Link className='block p-4 hover:bg-gray-800 transition-all' href='/profile'><Image className='size-8 object-cover rounded-full' src={user?.picture ?? '/defaults/user.png'} alt='User' width={25} height={25} /></Link>
      </div>
    </div>
  )
}