"use client";

import * as zod from 'zod'

import Link from "next/link";
import Image from 'next/image';

import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod'
import { LoginValidator } from "@/schema/auth"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/loading-button";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/actions/auth";
import { toast } from 'sonner';
import { detectOS, detectBrowser } from '@/lib/detectUser';

export const LoginForm = () => {

  const router = useRouter()

  const client = detectOS() as string
  const browser = detectBrowser()

  const form = useForm({
    resolver: zodResolver(LoginValidator),
    defaultValues: {
      username: '',
      password: '',
      client,
      browser
    },
  })

  const mutation = useMutation({
    mutationFn: (values: zod.infer<typeof LoginValidator>) => login(values),
    onSuccess: (data) => {
      if (data.status === 404) {
        toast.error(data.message)
      } else if (data.status === 200) {
        toast.success(data.message)
        router.push('/')
      }
    },
    onError: (d) => console.log(d)
  })

  const loginHandler = () => {
    mutation.mutate(form.getValues())
  }

  return (
    <div>
      <Image alt='Logo' width={80} height={80} src='/logo.png' className='my-4 mx-auto' />
      <h1 className='font-bold text-center mb-4'>Welcome Back!</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(loginHandler)} className='flex flex-col gap-y-4'>
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
            <Link href='/register' className='text-xs link'>Don't have an account?</Link>
            <Link href='/forgot-password' className='text-xs link'>Forgot password?</Link>
          </div>

          <LoadingButton loading={mutation.status === 'pending'} type='submit' className='w-fit' variant='blue'>Login</LoadingButton>
        </form>
      </Form>
    </div>
  )
}