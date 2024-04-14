"use client";

import * as zod from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";

import { useUser } from "@/hooks";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { toast } from 'sonner';
import { update } from "@/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfileValidator } from "@/schema/auth";
import { Save } from "lucide-react";
import { SettingsSectionTitle } from './settings-section-title';

export const EditProfileComponent = () => {

  const { user, isLoading } = useUser()

  const form = useForm({
    defaultValues: {
      name: user?.name,
      username: user?.username,
      email: user?.email,
      bio: user?.bio,
      gender: user?.gender,
      website: user?.website,
    },
    resolver: zodResolver(EditProfileValidator)
  })

  const mutation = useMutation({
    mutationFn: (data: { values: any, id: number }) => update(data.values, data.id),
    onSuccess: (data) => {
      toast.message(data?.message)
    }
  })

  const updateHandler = () => {
    mutation.mutate({
      values: form.getValues() as zod.infer<typeof EditProfileValidator>, 
      id: user?.id as number
    })
  }

  useEffect(() => {
    form.setValue('name', user?.name)
    form.setValue('username', user?.username)
    form.setValue('email', user?.email)
    form.setValue('bio', user?.bio)
    form.setValue('gender', user?.gender)
    form.setValue('website', user?.website as string)
  }, [user])

  if (isLoading) return <div>Loading</div>

  return (
    <div className="rounded-md mb-2 gap-4 xl:flex">

      <SettingsSectionTitle label='Personal Information' />

      <Form {...form}>

        <form onSubmit={form.handleSubmit(updateHandler)} className='flex flex-col gap-y-4 xl:w-full'>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input defaultValue={user?.name} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input defaultValue={user?.username} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail Address</FormLabel>
                <FormControl><Input defaultValue={user?.email} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl><Textarea defaultValue={user?.bio as string} className='resize-none h-36' onChange={field.onChange}></Textarea></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={user?.gender}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl><Input defaultValue={user?.website as string} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end'>
            <LoadingButton className='text-black w-fit' onClick={updateHandler} loading={mutation.status === 'pending'} variant='blue' size='sm'><Save className='size-4' /> Save</LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
 