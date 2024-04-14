"use client";

import React from "react";

import { Loader } from "lucide-react";

import { logout } from "@/actions/user";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode,
  iconSize?: string,
  className?: string
}

const LogoutButton = ({ children, iconSize = 'size-4', className }: Props) => {

  const logoutMutation = useMutation({
    mutationFn: () => logout()
  })

  const handleLogout = () => {
    logoutMutation.mutate();
  }

  return (
    <div onClick={handleLogout} className={cn('flex items-center gap-2 w-full', className && className)}>
      <div>
        {children}
      </div>
      {logoutMutation.isPending && <Loader className={cn('animate-spin', iconSize && iconSize)} />}
    </div>
  );
}
 
export default LogoutButton;