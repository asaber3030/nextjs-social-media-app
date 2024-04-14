import { userLoggedData } from "@/actions/user";
import { EditProfileComponent } from "@/app/_components/user/edit-profile";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Edit Profile and user data'
}

interface Props {
  params: { username: string }
}

const EditProfilePage = async ({ params: { username } }: Props) => {

  const user = await userLoggedData()

  if (user?.username != username) {
    return notFound()
  }

  return (
    <EditProfileComponent />
  );
}
 
export default EditProfilePage;