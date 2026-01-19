import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { InlineError } from './ErrorDisplay'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div>
                <label className="form-label">{label}</label>
                <input
                    ref={ref}
                    className={`form-input ${error ? 'error' : ''} ${className}`}
                    {...props}
                />
                {error && <InlineError message={error} />}
            </div>
        )
    }
)

FormInput.displayName = 'FormInput'

export default FormInput

// Submit button with loading state - unified indigo theme
interface SubmitButtonProps {
    isLoading: boolean
    loadingText: string
    children: React.ReactNode
    variant?: 'primary' | 'accent'
    className?: string
}

export function SubmitButton({
    isLoading,
    loadingText,
    children,
    variant = 'primary',
    className = ''
}: SubmitButtonProps) {
    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-hover',
        accent: 'bg-accent hover:brightness-110'
    }

    return (
        <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 ${variantClasses[variant]} text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${className}`}
        >
            {isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    )
}
