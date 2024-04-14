"use client";

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SITE_URL } from "@/lib/constants";
import { UserItems } from "@/providers/user-items";
import { Post } from "@/types";
import { Archive, Copy, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";

// Actions
import { ChangePostStatusAction } from "./change-status";
import { UpdatePostAction } from "./edit-post";
import { SavePostStatusAction } from "./save-status";
import { DeletePostAction } from "./delete-post";
import { ArchivePostStatus } from "./archive-status";

interface Props {
  isSaved?: boolean,
  post: Post,
}

export const PostActions = ({ isSaved, post }: Props) => {

  const { push } = useRouter()
  const { user, current } = useContext(UserItems)

  const viewAction = () => {
    push(`/profile/${user?.username}/posts/${post.id}`)
  }
  const copyURLAction = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(`${SITE_URL}/posts/${post.id}`)
        toast.success("Copied to clipboard!")
      } catch (e) {
        toast.error("Failed to copy!")
      }
    }
  }

  return (
    <DropdownMenu>
      
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className='p-2 h-8 text-xs'><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56">

        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={viewAction}><Eye className='size-5 mr-4' /> View</DropdownMenuItem>
        <DropdownMenuItem onClick={copyURLAction}><Copy className='size-5 mr-4' /> Copy URL</DropdownMenuItem>
        <SavePostStatusAction isSaved={isSaved} post={post} />
        <ArchivePostStatus isArchived={post?.archived} post={post} />
        
        {current?.username === user?.username && (
          <>
            <DropdownMenuSeparator />
            <ChangePostStatusAction postId={post?.id} isPrivate={post?.private} />
            <UpdatePostAction post={post} />
            <DeletePostAction post={post} />
          </>
        )}
        
      </DropdownMenuContent>

    </DropdownMenu>
  );
}
 