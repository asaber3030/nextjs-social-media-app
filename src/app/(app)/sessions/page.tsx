import { getSessions } from "@/actions/user";
import { SessionsList } from "@/app/_components/user/sessions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login History",
  description: "User Login History"
}

const SessionsPage = async () => {

  const { data: sessions } = await getSessions()

  return (
    <SessionsList sessions={sessions} />
  );
}
 
export default SessionsPage;