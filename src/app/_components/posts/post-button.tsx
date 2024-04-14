"use client";

import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

import { cn, numberForUsers } from "@/lib/utils"
import { twMerge } from "tailwind-merge"

interface Props {
  icon: LucideIcon,
  number: number,
  disabled?: boolean,
  variant?: "outline" | "default" | "destructive" | "blue" | "success" | "secondary" | "ghost" | "link" | "filled" | null
  label?: string,
  fill?: string,
  stroke?: string,
  onClick?: () => void,
  className?: string,
  iconHasHover?: string
}

export const PostButton = ({ className, iconHasHover, label, variant = 'outline', fill, stroke, icon: Icon, number, disabled, onClick }: Props) => {
  return (
    <Button 
      variant={variant} 
      className={twMerge('p-2 h-8 text-xs bg-transparent border-none', className)}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon stroke={stroke ?? 'white'} fill={fill} className={cn('size-4', iconHasHover && iconHasHover)} />
      {label && (
        <span>{label}</span>
      )}
      <span>{numberForUsers(number)}</span>
    </Button>
  )
}