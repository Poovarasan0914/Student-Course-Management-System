import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAdminLogin } from '../hooks/api'
import { SuccessDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { ErrorAlert } from '../components/ui/Toast'
import AuthLayout from '../components/AuthLayout'
import { SubmitButton } from '../components/ui/FormInput'
import type { LoginFormValues } from '../types'

export default function AdminLogin() {
    const navigate = useNavigate()
    const loginMutation = useAdminLogin()
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

            const admin = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password
            })

            setSuccessMessage('Login successful! Redirecting to admin dashboard...')
            localStorage.setItem('currentAdmin', JSON.stringify(admin))
            setTimeout(() => navigate('/admin/dashboard'), 1000)
        } catch (error: any) {
            setErrorMessage(error.message || 'Invalid admin credentials. Please check your email and password.')
        }
    }

    return (
        <AuthLayout
            title="Admin Sign In"
            subtitle="Access the administration dashboard"
            badge={{ text: "Admin Portal", color: "red" }}
            linear="red-blue"
            footerLinks={[
                { text: "", linkText: "Student Login", to: "/login", color: "blue" },
                { text: "", linkText: "Staff Login", to: "/staff/login", color: "green" }
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
                        placeholder="Enter admin email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        disabled={loginMutation.isPending}
                    />
                    {errors.email && <InlineError message={errors.email.message || 'Invalid email'} />}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="form-label mb-0">Password</label>
                        <Link
                            to="/forgot-password?type=admin"
                            className="text-sm text-red-600 hover:text-red-800 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        type="password"
                        placeholder="Enter admin password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        disabled={loginMutation.isPending}
                    />
                    {errors.password && <InlineError message={errors.password.message || 'Invalid password'} />}
                </div>

                <SubmitButton isLoading={loginMutation.isPending} loadingText="Signing in..." color="red">
                    Sign in as Admin
                </SubmitButton>
            </form>
        </AuthLayout>
    )
}

