import { Badge } from "@/components/ui/badge";
import { Lock, Check } from "lucide-react";

export const PostPrivacyStatus = ({ postStatus, togglePostStatus }: { postStatus: boolean, togglePostStatus: () => void }) => {
  return (
    <Badge 
      variant={postStatus === true ? 'outline' : 'default'} 
      onClick={togglePostStatus} 
      className='rounded-sm cursor-pointer flex gap-1 items-center w-fit select-none'
    >
      {postStatus === true ? <Lock className='size-3' /> : <Check className='size-3' />}
      {postStatus === true ? "Private" : "Public"}
    </Badge>
  );
}
 