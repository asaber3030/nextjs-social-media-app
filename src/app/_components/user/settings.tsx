"use client";

import Link from "next/link";

import { Separator } from "@/components/ui/separator"
import { ChangePrivacy } from "./change-privacy";
import { ChangePassword } from "./change-password";
import { EditProfileComponent } from "./edit-profile";
import { ChevronLeftCircle, Cog } from "lucide-react";

import { route } from "@/lib";
import { useParams } from "next/navigation";

export const SettingsComponent = () => {

  const { username }: { username: string } = useParams()

  return (
    <div>
      <header className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-semibold flex items-center gap-2 m-0 p-0'><Cog /> Settings</h2>
        <Link href={route('profile', username)} className='flex items-center gap-2 text-gray-500 hover:text-gray-300'><ChevronLeftCircle className='size-5' /> Back to profile</Link>
      </header>
      <EditProfileComponent />
      <Separator className='my-4' />
      <ChangePrivacy />
      <Separator className='my-4' />
      <ChangePassword />
    </div>
  )
}