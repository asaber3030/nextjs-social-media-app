import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  user: User,
  avatarSize?: string,
  className?: string,
}

export const UserAvatar = ({ user, className, avatarSize = '16' }: Props) => {
  return (
    <Avatar className={cn(`flex justify-center rounded-full bg-red-50 size-${avatarSize}`, className)}>
      <AvatarImage src={user?.picture} alt="User picture" className={`w-full h-auto object-contain`} />
      <AvatarFallback className="h-full w-full uppercase">{user?.name[0] + user?.name[1]}</AvatarFallback>
    </Avatar>
  )
}