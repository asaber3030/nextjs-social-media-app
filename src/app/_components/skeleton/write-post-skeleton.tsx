import { Skeleton } from "@/components/ui/skeleton"

export const WritePostSkeleton = () => {
  return (
    <div className='w-full flex gap-4 mt-8 mb-4'>
      <Skeleton className='w-[80px] h-[70px] rounded-full' />
      <div className="w-full">
        <Skeleton className='w-[200px] h-4 rounded-md' />
        <Skeleton className='w-[80px] h-4 my-2 rounded-md' />
        <Skeleton className='w-full h-[120px] rounded-md' />
        <div className="flex justify-between gap-2 mt-2">
          <Skeleton className='w-24 h-10 rounded-md' />
          <div className='flex gap-1'>
            <Skeleton className='w-10 h-10 rounded-md' />
            <Skeleton className='w-10 h-10 rounded-md' />
            <Skeleton className='w-10 h-10 rounded-md' />
          </div>
        </div>
      </div>
    </div>
  )
}