import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useForgotPassword, useResetPassword } from '../hooks/api'
import { SuccessDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { ErrorAlert } from '../components/ui/Toast'
import AuthLayout from '../components/AuthLayout'
import { SubmitButton } from '../components/ui/FormInput'

type UserType = 'student' | 'staff' | 'admin'

interface ForgotPasswordFormValues {
    email: string
}

interface ResetPasswordFormValues {
    resetCode: string
    newPassword: string
    confirmPassword: string
}

const getUserTypeConfig = (userType: UserType) => {
    const configs = {
        student: {
            title: 'Reset Password',
            subtitle: 'Student account recovery',
            gradient: 'blue-green' as const,
            color: 'blue' as const,
            linkColor: 'blue' as const,
            loginPath: '/login',
            loginText: 'Back to Student Login'
        },
        staff: {
            title: 'Reset Password',
            subtitle: 'Staff account recovery',
            badge: { text: 'Staff Portal', color: 'green' as const },
            gradient: 'green-blue' as const,
            color: 'green' as const,
            linkColor: 'green' as const,
            loginPath: '/staff/login',
            loginText: 'Back to Staff Login'
        },
        admin: {
            title: 'Reset Password',
            subtitle: 'Admin account recovery',
            badge: { text: 'Admin Portal', color: 'red' as const },
            gradient: 'red-blue' as const,
            color: 'red' as const,
            linkColor: 'blue' as const, // Footer link only supports blue/green
            loginPath: '/admin/login',
            loginText: 'Back to Admin Login'
        }
    }
    return configs[userType]
}

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const userType = (searchParams.get('type') as UserType) || 'student'

    const config = getUserTypeConfig(userType)

    const forgotPasswordMutation = useForgotPassword()
    const resetPasswordMutation = useResetPassword()

    const [step, setStep] = useState<'email' | 'reset'>('email')
    const [email, setEmail] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const emailInputRef = useRef<HTMLInputElement>(null)
    const codeInputRef = useRef<HTMLInputElement>(null)

    const emailForm = useForm<ForgotPasswordFormValues>()
    const resetForm = useForm<ResetPasswordFormValues>()

    useEffect(() => {
        if (step === 'email' && emailInputRef.current) {
            emailInputRef.current.focus()
        } else if (step === 'reset' && codeInputRef.current) {
            codeInputRef.current.focus()
        }
    }, [step])

    const handleEmailSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            setErrorMessage('')
            setSuccessMessage('')

            await forgotPasswordMutation.mutateAsync({
                email: data.email,
                userType
            })

            setEmail(data.email)
            setSuccessMessage('If an account exists with this email, a reset code has been sent. Check your inbox!')
            setTimeout(() => {
                setStep('reset')
                setSuccessMessage('')
            }, 2000)
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to send reset code. Please try again.')
        }
    }

    const handleResetSubmit = async (data: ResetPasswordFormValues) => {
        try {
            setErrorMessage('')
            setSuccessMessage('')

            if (data.newPassword !== data.confirmPassword) {
                setErrorMessage('Passwords do not match')
                return
            }

            await resetPasswordMutation.mutateAsync({
                email,
                resetCode: data.resetCode,
                newPassword: data.newPassword,
                userType
            })

            setSuccessMessage('Password reset successful! Redirecting to login...')
            setTimeout(() => navigate(config.loginPath), 2000)
        } catch (error: any) {
            setErrorMessage(error.message || 'Invalid or expired reset code. Please try again.')
        }
    }

    return (
        <AuthLayout
            title={config.title}
            subtitle={config.subtitle}
            badge={'badge' in config ? config.badge : undefined}
            gradient={config.gradient}
            footerLinks={[
                { text: '', linkText: config.loginText, to: config.loginPath, color: config.linkColor }
            ]}
        >
            {successMessage && (
                <SuccessDisplay message={successMessage} onDismiss={() => setSuccessMessage('')} />
            )}

            {errorMessage && (
                <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage('')} />
            )}

            {step === 'email' ? (
                <>
                    <div className="mb-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Enter your email address and we'll send you a 6-digit code to reset your password.
                        </p>
                    </div>

                    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} noValidate className="space-y-4">
                        <div>
                            <label className="form-label">Email Address</label>
                            <input
                                {...emailForm.register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email format' }
                                })}
                                ref={(e) => {
                                    emailForm.register('email').ref(e)
                                    emailInputRef.current = e
                                }}
                                type="email"
                                placeholder="Enter your email"
                                className={`form-input ${emailForm.formState.errors.email ? 'error' : ''}`}
                                disabled={forgotPasswordMutation.isPending}
                            />
                            {emailForm.formState.errors.email && (
                                <InlineError message={emailForm.formState.errors.email.message || 'Invalid email'} />
                            )}
                        </div>

                        <SubmitButton
                            isLoading={forgotPasswordMutation.isPending}
                            loadingText="Sending code..."
                            color={config.color}
                        >
                            Send Reset Code
                        </SubmitButton>
                    </form>
                </>
            ) : (
                <>
                    <div className="mb-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-linear-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm">
                            We sent a 6-digit code to <strong>{email}</strong>. Enter the code below to reset your password.
                        </p>
                        <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                        >
                            Use different email
                        </button>
                    </div>

                    <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} noValidate className="space-y-4">
                        <div>
                            <label className="form-label">Reset Code</label>
                            <input
                                {...resetForm.register('resetCode', {
                                    required: 'Reset code is required',
                                    minLength: { value: 6, message: 'Code must be 6 digits' },
                                    maxLength: { value: 6, message: 'Code must be 6 digits' }
                                })}
                                ref={(e) => {
                                    resetForm.register('resetCode').ref(e)
                                    codeInputRef.current = e
                                }}
                                type="text"
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className={`form-input text-center text-2xl tracking-widest font-mono ${resetForm.formState.errors.resetCode ? 'error' : ''}`}
                                disabled={resetPasswordMutation.isPending}
                            />
                            {resetForm.formState.errors.resetCode && (
                                <InlineError message={resetForm.formState.errors.resetCode.message || 'Invalid code'} />
                            )}
                        </div>

                        <div>
                            <label className="form-label">New Password</label>
                            <input
                                {...resetForm.register('newPassword', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                type="password"
                                placeholder="Enter new password"
                                className={`form-input ${resetForm.formState.errors.newPassword ? 'error' : ''}`}
                                disabled={resetPasswordMutation.isPending}
                            />
                            {resetForm.formState.errors.newPassword && (
                                <InlineError message={resetForm.formState.errors.newPassword.message || 'Invalid password'} />
                            )}
                        </div>

                        <div>
                            <label className="form-label">Confirm Password</label>
                            <input
                                {...resetForm.register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === resetForm.watch('newPassword') || 'Passwords do not match'
                                })}
                                type="password"
                                placeholder="Confirm new password"
                                className={`form-input ${resetForm.formState.errors.confirmPassword ? 'error' : ''}`}
                                disabled={resetPasswordMutation.isPending}
                            />
                            {resetForm.formState.errors.confirmPassword && (
                                <InlineError message={resetForm.formState.errors.confirmPassword.message || 'Passwords must match'} />
                            )}
                        </div>

                        <SubmitButton
                            isLoading={resetPasswordMutation.isPending}
                            loadingText="Resetting password..."
                            color={config.color}
                        >
                            Reset Password
                        </SubmitButton>
                    </form>

                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-800 text-center">
                            ⏰ Code expires in 15 minutes. Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="font-medium text-amber-900 hover:underline"
                            >
                                Resend
                            </button>
                        </p>
                    </div>
                </>
            )}
        </AuthLayout>
    )
}
