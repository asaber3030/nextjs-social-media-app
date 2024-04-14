"use client";

import * as zod from 'zod'

import Link from "next/link";
import Image from 'next/image';

import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterValidator } from "@/schema/auth"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/loading-button";

import { useMutation } from "@tanstack/react-query";
import { register } from "@/actions/auth";
import { toast } from 'sonner';
import { detectOS, detectBrowser } from '@/lib/detectUser';

export const RegisterForm = () => {

  const client = detectOS() as string
  const browser = detectBrowser()

  const form = useForm({
    resolver: zodResolver(RegisterValidator),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      client,
      browser
    },
  })

  const mutation = useMutation({
    mutationFn: (values: zod.infer<typeof RegisterValidator>) => register(values),
    onSuccess: (data) => {
      toast.message(data.message)
    }
  })

  const registerHandler = () => {
    mutation.mutate(form.getValues())
  }

  return (
    <div>

      <Image alt='Logo' width={80} height={80} src='/logo.png' className='my-4 mx-auto' />

      <h1 className='font-bold text-center mb-4'>Welcome Back!</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(registerHandler)} className='flex flex-col gap-y-4'>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
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
                <FormControl><Input {...field} /></FormControl>
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
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type='password' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center justify-between'>
            <Link href='/login' className='text-xs link'>Already have an account?</Link>
          </div>

          <LoadingButton loading={mutation.status === 'pending'} type='submit' className='w-fit' variant='blue'>Register</LoadingButton>
      
        </form>

      </Form>

    </div>
  )
}