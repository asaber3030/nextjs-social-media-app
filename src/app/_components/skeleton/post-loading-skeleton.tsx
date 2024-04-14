import { Skeleton } from "@/components/ui/skeleton"

export const PostSkeleton = () => {
  return (
    <div className='w-full flex gap-4'>
      <Skeleton className='w-[80px] h-[70px] rounded-full' />
      <div className="w-full">
        <Skeleton className='w-[400px] h-4 mb-2 rounded-md' />
        <Skeleton className='w-[100px] h-4 mb-2 rounded-md' />
        <Skeleton className='w-full h-[120px] rounded-md' />
        <div className="flex gap-2 mt-2">
          <Skeleton className='w-11 h-8 rounded-md' />
          <Skeleton className='w-24 h-8 rounded-md' />
          <Skeleton className='w-28 h-8 rounded-md' />
          <Skeleton className='w-16 h-8 rounded-md' />
        </div>
      </div>
    </div>
  )
}