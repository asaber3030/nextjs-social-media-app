"use client";

import { Session } from "@/types"
import { Dot } from "lucide-react";

import moment from "moment"
import Image from "next/image"

export const SessionsList = ({ sessions }: { sessions: Session[] }) => {

  console.log(sessions)

  return (
    <div className='space-y-2'>
      {sessions.map(session => (
        <SessionsList.Session 
          session={session}
          key={`session-idx-${session.id}`}
        />
      ))}
    </div>
  )
}

SessionsList.Session = ({ session }: { session: Session }) => {
  return (
    <div className='p-2 flex items-center gap-4'>
      <SessionsList.OS client={session.client} />
      <div>
        <h2 className='font-semibold flex items-center text-gray-300'>Login Activity <Dot /> {moment(session.createdAt).fromNow()}</h2>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500 text-sm'>{session.client}</span>
          <span className='text-gray-500 text-sm'>{session.browser}</span>
        </div>
        
      </div>
    </div>
  )
}

SessionsList.OS = ({ client }: { client: string }) => {
  switch (client) {
    case 'Windows':
      return <SessionsList.OSContainer><Image alt="Windows Icon" src='/defaults/os/windows.svg' layout="contain" width={0} height={0}  className="w-full h-auto" /></SessionsList.OSContainer>

    case 'Mac OS':
      return <SessionsList.OSContainer><Image alt="Mac OS" src='/defaults/os/mac.svg' layout="contain" width={0} height={0}  className="w-full h-auto" /></SessionsList.OSContainer>

    case 'iOS':
      return <SessionsList.OSContainer><Image alt="iOS" src='/defaults/os/ios.svg' layout="contain" width={0} height={0}  className="w-full h-auto" /></SessionsList.OSContainer>

    case 'Android':
      return <SessionsList.OSContainer><Image alt="Android" src='/defaults/os/android.svg' layout="contain" width={0} height={0}  className="w-full h-auto" /></SessionsList.OSContainer>

    case 'Linux':
      return <SessionsList.OSContainer><Image alt="Linux" src='/defaults/os/linux.svg' layout="contain" width={0} height={0}  className="w-full h-auto" /></SessionsList.OSContainer>
  }
}

SessionsList.OSContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-full size-20 bg-gray-400 flex items-center justify-center p-4">
      {children}
    </div>
  )
}