"use client";

import React, { ChangeEvent, FormEvent } from 'react'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils';

interface Props { 
  page: number | null, 
  value: string,
  changeValue: any,
  className?: string
}

export const SearchInput = ({ className, page, value, changeValue }: Props) => {

  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`?filter=${value}`)
  }

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <Search className='absolute -translate-y-1/2 size-5 left-3 top-1/2 text-gray-500' />
        <Input
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => changeValue(event.target.value)}
          className='pl-10 focus:outline-none focus:border-1 focus:border-gray-800 focus:ring-1 focus:ring-gray-800 focus:ring-offset-0'
          placeholder='Search for users...'
        />
      </form>
    </div>
  )
}