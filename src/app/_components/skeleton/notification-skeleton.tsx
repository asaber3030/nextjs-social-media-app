import { Skeleton } from "@/components/ui/skeleton"

export const NotificationSkeleton = () => {
  return (
    <div>
      
      <div className='w-full flex gap-4 py-4'>
        <div className="w-full">
          <div className='flex justify-between'>
            <Skeleton className='w-[200px] h-2 mb-2 rounded-md' />
            <Skeleton className='w-8 h-8' />
          </div>
          <Skeleton className='w-[150px] h-2 mb-2 rounded-md' />
          <Skeleton className='w-[300px] h-2 mb-2 rounded-md' />
          <Skeleton className='w-[350px] h-2 mb-2 rounded-md' />
          <Skeleton className='w-[200px] h-2 mb-2 rounded-md' />
        </div>
      </div>
    </div>
  )
}