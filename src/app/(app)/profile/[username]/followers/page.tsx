import { getFollowersByUsername, getUserByUsername } from "@/actions/user";
import { FollowersComponent } from "@/app/_components/user/followers";

interface Props { 
  params: { username: string } 
}

export const generateMetadata = ({ params }: Props) => {
  return {
    title: `@${params.username} Followers`
  }
}

const FollowersPage = async ({ params }: Props) => {
  const { user } = await getUserByUsername(params.username)
  const { followers }: any = await getFollowersByUsername(user?.username as string)

  return (
    <FollowersComponent followers={followers} />
  );
}
 
export default FollowersPage;