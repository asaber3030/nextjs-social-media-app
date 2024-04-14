import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "@/types"
import { useRouter } from "next/navigation"

interface Props {
   current: User, 
   user: User 
}

export const UserProfileTabs = ({ current, user }: Props) => {
  const router = useRouter()
  return (
    <div>
      <TabsList className="mx-auto text-center w-full p-0">
        <TabsTrigger onClick={ () => router.push("?tab=posts") } className='w-full data-[state=active]:bg-lightBg p-2.5' value="posts">Posts</TabsTrigger>
        {user?.username === current.username && (
          <>
            <TabsTrigger onClick={ () => router.push("?tab=saved") } className='w-full data-[state=active]:bg-lightBg p-2.5' value="saved">Saved</TabsTrigger>
            <TabsTrigger onClick={ () => router.push("?tab=archived") } className='w-full data-[state=active]:bg-lightBg p-2.5' value="archived">Archived</TabsTrigger>
            <TabsTrigger onClick={ () => router.push("?tab=trashed") } className='w-full data-[state=active]:bg-lightBg p-2.5' value="trashed">Trashed Posts</TabsTrigger>
          </>
        )}
      </TabsList>
    </div>
  )
}

