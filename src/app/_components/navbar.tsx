"use client"

import LogoutButton from "./authentication/logout-button"
import Image from "next/image"
import Link from "next/link"

import { useUser } from "@/hooks"
import { useRouter } from "next/navigation"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { NotificationsDropdown } from "./notifications-dropdown"
import { Bell, Blocks, Cog, Edit, History, ImageIcon, Lock, LogOut, Power, User } from "lucide-react"
import { route } from "@/lib"

export const UserNavbar = () => {
  
  const { user } = useUser()
  const { push } = useRouter()

  return (
    <nav className='flex justify-between mb-4 items-center mx-0 px-0 border-b xl:container' style={{ padding: 3, paddingTop: 25, paddingBottom: 10 }}>

      <section>
        <Link href='/' className='flex gap-1 items-center'>
          <Power className="rotate-90 text-green-900" />
          <span>onnectiFy</span>
        </Link>
      </section>

      <section className='size-10 my-2'>
        <Link className='font-bold text-center' href='/'><Image style={{ width: '100%', height: 'auto' }} className='mb-2' src='/logo-white.png' alt='Logo' width={0} height={0} sizes="100vw" /></Link>
      </section>

      <section className='flex gap-2'>
        
        {/* Notifications */}
        <NotificationsDropdown />

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon' className='text-black'><User /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>@{user?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={ () => push(route('profile', user?.username)) } className='flex items-center gap-4'><User /> Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={ () => push(route('editProfile', user?.username)) } className='flex items-center gap-4'><Edit /> Edit Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={ () => push(route('editPicture', user?.username)) } className='flex items-center gap-4'><ImageIcon /> Profile Picture</DropdownMenuItem>
            <DropdownMenuItem onClick={ () => push(route('settings', user?.username)) } className='flex items-center gap-4'><Cog /> Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={ () => push(route('settings', user?.username)) } className='flex items-center gap-4'><Lock /> Privacy</DropdownMenuItem>
            <DropdownMenuItem onClick={ () => push(route('notifications')) } className='flex items-center gap-4'><Bell /> Notifications</DropdownMenuItem>
            <DropdownMenuItem onClick={ () => push(route('sessions')) } className='flex items-center gap-4'><History /> Login Sessions</DropdownMenuItem>
            <LogoutButton><DropdownMenuItem className='text-red-500 font-bold hover:bg-red-700/20 hover:text-red-700/20 flex items-center gap-4'><LogOut /> Logout</DropdownMenuItem></LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>

      </section>

    </nav>
  )
}