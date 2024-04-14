import { UserNavbar } from "../_components/navbar";
import { MobileNavigator } from "../_components/mobile-navigator";
import { ScreenSidebar } from "../_components/screen-sidebar";

import { userLoggedData } from "@/actions/user";
import { redirect } from "next/navigation";

import UserProvider from "@/providers/user";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {

  const user = await userLoggedData()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div>
      <UserProvider value={user}>
        <UserNavbar />
        <main className='xl:container lg:container px-0 xl:flex lg:flex' style={{ padding: 0 }}>
          <ScreenSidebar />
          <div className='w-full pr-0 mr-0 pl-4 xl:pr-0 lg:pr-0'>
            {children}
          </div>
        </main>
        <MobileNavigator />
      </UserProvider>
    </div>
  );
}
 
export default AppLayout;