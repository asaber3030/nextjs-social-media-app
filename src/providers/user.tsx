"use client";

import { createContext } from "react";
import { useUser } from "@/hooks";
import { User } from "@/types";

export type UserContextType = User

export const UserContext = createContext<UserContextType>({
  id: 0,
  username: '',
  name: '',
  email: '',
  password: '',
  picture: '',
  bio: '',
  website: '',
  gender: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  private: false,
})

const UserProvider = ({ children, value }: { children: React.ReactNode, value: any }) => {

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
 
export default UserProvider;