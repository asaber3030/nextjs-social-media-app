import { EditPictureComponent } from "@/app/_components/user/edit-picture";
import { Metadata } from "next";

import { getSession, getUser, userLoggedData } from "@/actions/user";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Edit Profile Picture',
  description: 'Edit Profile Picture'
}

interface Props {
  params: { username: string }
}

const EditPicturePage = async ({ params: { username } }: Props) => {

  const user = await userLoggedData()

  if (user?.username != username) {
    return notFound()
  }

  return (
    <EditPictureComponent />
  );
}
 
export default EditPicturePage;