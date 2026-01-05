import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useStaffLogin } from '../hooks/api'
import { SuccessDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { ErrorAlert } from '../components/ui/Toast'
import AuthLayout from '../components/AuthLayout'
import { SubmitButton } from '../components/ui/FormInput'
import type { LoginFormValues } from '../types'

export default function StaffLogin() {
    const navigate = useNavigate()
    const loginMutation = useStaffLogin()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>()

    const emailInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus()
        }
    }, [])

    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setErrorMessage('')
            setSuccessMessage('')

            const staffMember = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password
            })

            setSuccessMessage('Login successful! Redirecting to dashboard...')
            localStorage.setItem('currentStaff', JSON.stringify(staffMember))
            setTimeout(() => navigate('/staff/dashboard'), 1000)
        } catch (error: any) {
            setErrorMessage(error.message || 'Invalid email or password. Please check your credentials and try again.')
        }
    }

    return (
        <AuthLayout
            title="Staff Sign In"
            subtitle="Access your instructor dashboard"
            badge={{ text: "Staff Portal", color: "green" }}
            gradient="green-blue"
            footerLinks={[
                { text: "Don't have a staff account?", linkText: "Register as Staff", to: "/staff/signup", color: "green" },
                { text: "", linkText: "Student Login", to: "/login", color: "blue" }
            ]}
        >
            {successMessage && (
                <SuccessDisplay message={successMessage} onDismiss={() => setSuccessMessage('')} />
            )}

            {errorMessage && (
                <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage('')} />
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                    <label className="form-label">Email</label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email format' }
                        })}
                        ref={(e) => {
                            register('email').ref(e)
                            emailInputRef.current = e
                        }}
                        type="email"
                        placeholder="Enter your staff email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        disabled={loginMutation.isPending}
                    />
                    {errors.email && <InlineError message={errors.email.message || 'Invalid email'} />}
                </div>

                <div>
                    <label className="form-label">Password</label>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        type="password"
                        placeholder="Enter your password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        disabled={loginMutation.isPending}
                    />
                    {errors.password && <InlineError message={errors.password.message || 'Invalid password'} />}
                </div>

                <SubmitButton isLoading={loginMutation.isPending} loadingText="Signing in..." color="green">
                    Sign in as Staff
                </SubmitButton>
            </form>
        </AuthLayout>
    )
}
