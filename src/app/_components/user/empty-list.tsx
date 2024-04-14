"use client";

import Image from "next/image"

export const EmptyState = ({ title, description }: { title: React.ReactNode, description?: React.ReactNode }) => {
  return (
    <div className='flex flex-col justify-center items-center p-4 rounded-md shadow-md bg-lightBg py-8'>
      <Image src='/defaults/empty.svg' alt='Empty Image' width={100} height={100} className='mx-auto' />
      <h3 className='text-lg font-semibold mt-4'>{title}</h3>
    </div>
  )
}