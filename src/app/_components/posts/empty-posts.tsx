"use client";

import Image from "next/image"

export const EmptyPosts = ({ label = 'This user has no posts!' }: { label?: string }) => {
  return (
    <div className='bg-lightBg p-4 shadow-lg rounded-md'>
      <Image alt='Empty posts' src='/defaults/empty-post.svg' width={100} height={100} className='mx-auto' />
      <h2 className="text-xl text-center font-bold mt-8">{label}</h2>
    </div>
  )
}