import { NotificationsComponent } from "@/app/_components/user/notifications/notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Notifications'
}

const NotificationsPage = async () => {


  return (
    <NotificationsComponent/>
  );
}
 
export default NotificationsPage;