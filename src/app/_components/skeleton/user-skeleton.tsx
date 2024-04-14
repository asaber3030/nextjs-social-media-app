import { Skeleton } from "@/components/ui/skeleton";

export const UserLongSkeleton = ({ repeat = 1 }: { repeat?: number }) => {
  return (
    <div className="flex flex-col gap-y-3">
      {Array.from({ length: repeat }).map((_, idx) => (
        <div className='flex gap-2 items-center' key={`sk-user-long-idx-${idx}`}>
          <div className="w-24 h-20">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          <div className="flex w-full justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-52" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}