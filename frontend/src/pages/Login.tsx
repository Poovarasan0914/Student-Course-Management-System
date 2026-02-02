import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useStudentLogin } from '../hooks/api'
import { SuccessDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { ErrorAlert } from '../components/ui/Toast'
import AuthLayout from '../components/AuthLayout'
import { SubmitButton } from '../components/ui/FormInput'
import type { LoginFormValues } from '../types'

export default function Login() {
    const navigate = useNavigate()
    const loginMutation = useStudentLogin()
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

            const user = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password
            })

            setSuccessMessage('Login successful! Redirecting...')
            localStorage.setItem('currentUser', JSON.stringify(user))
            setTimeout(() => navigate('/dashboard'), 1000)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please check your credentials and try again.'
            setErrorMessage(errorMessage)
        }
    }

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account"
            footerLinks={[
                { text: "Don't have an account?", linkText: "Create one", to: "/signup" },
                { text: "", linkText: "Staff Login →", to: "/staff/login" }
            ]}
        >
            {successMessage && (
                <SuccessDisplay message={successMessage} onDismiss={() => setSuccessMessage('')} />
            )}

            {errorMessage && (
                <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage('')} />
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
                        placeholder="Enter your email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        disabled={loginMutation.isPending}
                    />
                    {errors.email && <InlineError message={errors.email.message || 'Invalid email'} />}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="form-label mb-0">Password</label>
                        <Link
                            to="/forgot-password?type=student"
                            className="text-sm text-primary hover:text-primary-hover"
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
                        placeholder="Enter your password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        disabled={loginMutation.isPending}
                    />
                    {errors.password && <InlineError message={errors.password.message || 'Invalid password'} />}
                </div>

                <SubmitButton isLoading={loginMutation.isPending} loadingText="Signing in...">
                    Sign in
                </SubmitButton>
            </form>
        </AuthLayout>
    )
}

