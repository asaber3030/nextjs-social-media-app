import { getFollowingsByUsername, getUserByUsername } from "@/actions/user";
import { FollowingComponent } from "@/app/_components/user/following";
import { Following } from "@/types";

export const generateMetadata = ({ params }: { params: { username: string } }) => {
  return {
    title: `@${params.username} Following List`
  }
}
interface Props { 
  params: { username: string } 
}

const FollowingPage = async ({ params }: Props) => {  

  const { user } = await getUserByUsername(params.username)
  const { followings }: any = await getFollowingsByUsername(user?.username as string)
  
  return (
    <FollowingComponent followings={followings} />
  );
}
 
export default FollowingPage;