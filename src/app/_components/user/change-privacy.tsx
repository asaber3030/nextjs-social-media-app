"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/loading-button"
import { Skeleton } from "@/components/ui/skeleton"

import { useState } from "react"
import { useUser } from "@/hooks"
import { useMutation } from "@tanstack/react-query"

import { changePrivacy } from "@/actions/user"

import { toast } from "sonner"
import { Lock, LockOpen } from "lucide-react"
import { SettingsSectionTitle } from "./settings-section-title"

export const ChangePrivacy = () => {

  const { user, isLoading } = useUser()
  const [state, setState] = useState(user?.private)

  const mutation = useMutation({
    mutationFn: (value: boolean) => changePrivacy(value),
    onSuccess: (data) => {
      toast.message(data.message)
    }
  })

  const savePrivacy = () => {
    mutation.mutate(state as boolean)
  }

  if (isLoading) return <ChangePrivacy.Loading />

  return (
    <div className="rounded-md mb-2 gap-4 xl:flex">
      
      <SettingsSectionTitle label='Profile Privacy' />
      
      <div className='w-full'>
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="privacy-mode"
            defaultChecked={user?.private}
            onCheckedChange={ (value: boolean) => setState(old => value) }
          />
          <Label htmlFor="privacy-mode" className='text-gray-500'>Private Account?</Label>
        </div>
        <div className='flex items-center justify-end'>
          <LoadingButton 
            onClick={savePrivacy} 
            loading={mutation.status === 'pending'} 
            className='text-black text-xs'
            variant='blue'
            size='sm'
          >
            {!state ? <LockOpen className='size-4' /> : <Lock className='size-4' />}
            <span>Change to <b>{!state ? 'Public' : 'Private'}</b></span>
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}

ChangePrivacy.Loading = () => {
  return (
    <div className='mb-2'>
      <Skeleton className='w-full h-[150px]' />
    </div>
  )
}