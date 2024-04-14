import { checkRelationship, getUserByUsername, userLoggedData } from "@/actions/user";
import { ProfileComponent } from "@/app/_components/user/profile";

export const generateMetadata = async () => {
  const current = await userLoggedData();
  return {
    title: `@${current?.username} Profile`,
    description: `Posts of @${current?.username} and his data.`,
  }
}

interface Props {
  params: { username: string }
}

const ProfilePage = async ({ params }: Props) => {

  const current = await userLoggedData();
  const { user } = await getUserByUsername(params.username)
  
  const isFriends = await checkRelationship(user?.id as number, current?.id as number)

  return (
    <ProfileComponent isFriends={isFriends} />
  );
}
 
export default ProfilePage;