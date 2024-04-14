"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react";

import { NotificationsComponent } from "./user/notifications/notifications";

export const NotificationsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='text-black'><Bell /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[600px] p-4 overflow-y-scroll max-h-[800px]">
        <NotificationsComponent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}