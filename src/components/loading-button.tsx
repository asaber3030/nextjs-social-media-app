import { Loader } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        blue:
          "bg-blue-500 text-destructive-foreground hover:bg-blue-500/90",
        success:
          "bg-green-700 text-destructive-foreground hover:bg-green-700/90",
        secondary:
          "bg-gray-100 text-secondary-foreground hover:bg-gray-100/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const LoadingButton = ({ className, size, variant, loading, ...props }: LoadingButtonProps) => {
  return (
    <Button {...props} className={cn(buttonVariants({ variant, size, className }))} disabled={loading}>
      {loading && <Loader className='animate-spin size-4' />}
      {props.children}
    </Button>
  )
}