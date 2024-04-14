"use client";

import * as zod from 'zod'

import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { newCollection } from "@/actions/user";
import { toast } from "sonner";
import { revalidate } from '@/actions';
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCollectionValidator } from "@/schema/auth";

import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { UserItems } from "@/providers/user-items";

interface Props {
  children: React.ReactNode,
}

export const NewCollectionButton = ({ children }: Props) => {

  const { invalidateQueries } = useQueryClient()
  const { user } = useContext(UserItems)

  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(CreateCollectionValidator),
    defaultValues: {
      title: ''
    },
  })

  const mutation = useMutation({
    mutationFn: (values: zod.infer<typeof CreateCollectionValidator>) => newCollection(values),
    onSuccess: (data) => {
      if (data.status === 201) {
        toast.message("Collection created!")
      }
      invalidateQueries({ queryKey: ['user', user?.id, 'collections'] })
    }
  })

  const onClick = () => {
    mutation.mutate(form.getValues())
    form.setValue('title', '')
    revalidate(`/profile/${user?.username}`)
    setOpen(_ => false)
  }

  return (
    <AlertDialog open={open} defaultOpen={false} onOpenChange={setOpen}>
      
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        
        <AlertDialogHeader className='text-left'>
          <AlertDialogTitle>Create New Collection</AlertDialogTitle>
          <AlertDialogDescription>Collections allow you to share your photos, memories with others.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onClick)} className='flex flex-col gap-y-4'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection title</FormLabel>
                  <FormControl><Input {...field} placeholder="Collection Title: (Madrid Travel..)" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={mutation.isPending} type='submit' className='w-fit' variant='blue' size='sm'><Plus className='size-4' /> Create</LoadingButton>
          </form>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel className='m-0 px-5 h-9 '>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
        
      </AlertDialogContent>

    </AlertDialog>
    
  );
}
 