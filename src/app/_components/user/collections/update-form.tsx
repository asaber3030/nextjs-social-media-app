"use client";

import * as zod from 'zod'

import { useForm } from "react-hook-form"

import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCollectionValidator } from "@/schema/auth"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/loading-button";

import { useMutation } from "@tanstack/react-query";
import { Collection } from '@/types';
import { updateCollection } from '@/actions/user';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export const UpdateCollectionForm = ({ collection }: { collection: Collection }) => {

  const form = useForm({
    resolver: zodResolver(UpdateCollectionValidator),
    defaultValues: {
      title: collection.title,
      order: collection.order
    },
  })

  const mutation = useMutation({
    mutationFn: (values: zod.infer<typeof UpdateCollectionValidator>) => updateCollection(collection.id, values),
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.message("Collection details updated")
      }
    }
  })

  const updateHandler = () => {
    mutation.mutate(form.getValues())
  }  

  return (
    <div className='space-y-4 p-4 rounded-md bg-lightBg'>
      <section>
        <h1 className='text-lg font-bold mb-4 border-b pb-2'>Update Details</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateHandler)} className='flex flex-col gap-y-4'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-gray-200'>Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={() => (
                <FormItem>
                  <FormLabel className='font-bold text-gray-200'>Order</FormLabel>
                  <FormControl><Input type='text' {...form.register('order', { valueAsNumber: true })} /></FormControl>
                  <FormLabel className='text-gray-500 text-xs'>Please add your collection order.</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton size='sm' variant='outline' loading={mutation.status === 'pending'} type='submit' className='w-fit text-white'><Save className='size-4' /> Save</LoadingButton>
          </form>

        </Form>

      </section>

    </div>
  );
}
 