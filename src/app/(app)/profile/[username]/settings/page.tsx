import { userLoggedData } from "@/actions/user";
import { SettingsComponent } from "@/app/_components/user/settings";
import { notFound } from "next/navigation";

export const generateMetadata = ({ params }: { params: { username: string } }) => {
  return {
    title: `@${params.username} Settings`
  }
}

interface Props {
  params: { 
    username: string 
  }
}

const SettingsPage = async ({ params }: Props) => {

  const user = await userLoggedData()

  if (user?.username != params.username) {
    return notFound()
  }

  return (
    <SettingsComponent />
  );
}
 
export default SettingsPage;