import * as React from "react"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"

        const variants = {
            default: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
            destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
            outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-none",
            secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-none",
            ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900 shadow-none",
            link: "text-blue-600 underline-offset-4 hover:underline shadow-none",
            success: "bg-green-600 text-white hover:bg-green-700 active:scale-95",
        }

        const sizes = {
            default: "h-10 px-4 py-2 rounded-lg text-sm",
            sm: "h-9 px-3 rounded-md text-xs",
            lg: "h-11 px-8 rounded-lg text-base",
            icon: "h-10 w-10 rounded-lg",
        }

        return (
            <button
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
                ref={ref}
                {...props}
            />
        )
    }
)

Button.displayName = "Button"

export { Button }
