"use client"

import * as zod from 'zod'

import { LoadingButton } from "@/components/loading-button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useUser } from "@/hooks"
import { useMutation } from "@tanstack/react-query"
import { useForm } from 'react-hook-form'

import { changePassword } from "@/actions/user"

import { toast } from "sonner"

import { EditPasswordValidator } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Skeleton } from '@/components/ui/skeleton'
import { Save } from 'lucide-react'
import { SettingsSectionTitle } from './settings-section-title'

export const ChangePassword = () => {

  const { user, isLoading } = useUser()

  const form = useForm({
    resolver: zodResolver(EditPasswordValidator),
    defaultValues: {
      password: '',
      newPassword: ''
    },
  })

  const mutation = useMutation({
    mutationFn: (values: zod.infer<typeof EditPasswordValidator>) => changePassword(values),
    onSuccess: (data) => {
      toast.message(data.message)
    }
  })

  const changePasswordHandler = () => {
    mutation.mutate(form.getValues())
  }

  if (isLoading) return <ChangePassword.Loading />

  return (
    <div className="rounded-md mb-2 gap-4 xl:flex">

      <SettingsSectionTitle label='Change Password' /> 

      <div className='mb-4 w-full'>

        <Form {...form}>
          
          <form onSubmit={form.handleSubmit(changePasswordHandler)} className='flex flex-col gap-y-4'>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input className='bg-lightBg/10' type='password' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl><Input className='bg-lightBg/10' type='password' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-end'>
              <LoadingButton className='text-black' variant='blue' size='sm' loading={mutation.status === 'pending'}><Save className='size-4' /> Save</LoadingButton>
            </div>          
          </form>

        </Form>

      </div>
      
    </div>
  )
}

ChangePassword.Loading = () => {
  return (
    <div className='mb-2'>
      <Skeleton className='w-full h-[250px]' />
    </div>
  )
}