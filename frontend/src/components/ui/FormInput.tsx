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

// Submit button with loading state
interface SubmitButtonProps {
    isLoading: boolean
    loadingText: string
    children: React.ReactNode
    color?: 'blue' | 'green' | 'red'
    className?: string
}

export function SubmitButton({
    isLoading,
    loadingText,
    children,
    color = 'blue',
    className = ''
}: SubmitButtonProps) {
    const colorClasses = {
        blue: 'bg-blue-600 hover:bg-blue-700',
        green: 'bg-green-600 hover:bg-green-700',
        red: 'bg-red-600 hover:bg-red-700'
    }

    return (
        <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-2.5 ${colorClasses[color]} text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${className}`}
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
