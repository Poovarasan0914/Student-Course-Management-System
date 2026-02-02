import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateSignup } from '../hooks/api'
import { SuccessDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { ErrorAlert } from '../components/ui/Toast'
import AuthLayout from '../components/AuthLayout'
import { SubmitButton } from '../components/ui/FormInput'
import type { SignupFormValues } from '../types'

export default function Signup() {
    const navigate = useNavigate()
    const createSignupMutation = useCreateSignup()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<SignupFormValues>()

    const firstNameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (firstNameInputRef.current) {
            firstNameInputRef.current.focus()
        }
    }, [])

    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const password = watch('password', '')

    const onSubmit = async (data: SignupFormValues) => {
        try {
            setErrorMessage('')
            setSuccessMessage('')

            await createSignupMutation.mutateAsync({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                acceptTerms: data.acceptTerms
            })

            setSuccessMessage('Account created successfully! Redirecting to login...')
            reset()
            setTimeout(() => navigate('/login'), 1500)
        } catch (error: unknown) {
            const serverMessage = error instanceof Error ? error.message : 'Unable to create account. Please try again.'
            setErrorMessage(serverMessage)
        }
    }

    return (
        <AuthLayout
            title="Create an account"
            footerLinks={[
                { text: "Already have an account?", linkText: "Sign in", to: "/login" },
                { text: "", linkText: "Register as Staff", to: "/staff/signup" }
            ]}
        >
            {successMessage && (
                <SuccessDisplay message={successMessage} onDismiss={() => setSuccessMessage('')} />
            )}

            {errorMessage && (
                <ErrorAlert message={errorMessage} title="Registration Failed" onDismiss={() => setErrorMessage('')} />
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">First name</label>
                        <input
                            {...register('firstName', { required: 'First name is required' })}
                            ref={(e) => {
                                register('firstName').ref(e)
                                firstNameInputRef.current = e
                            }}
                            type="text"
                            placeholder="John"
                            className={`form-input ${errors.firstName ? 'error' : ''}`}
                            disabled={createSignupMutation.isPending}
                        />
                        {errors.firstName && <InlineError message={errors.firstName.message || 'Required'} />}
                    </div>

                    <div>
                        <label className="form-label">Last name</label>
                        <input
                            {...register('lastName', { required: 'Last name is required' })}
                            type="text"
                            placeholder="Doe"
                            className={`form-input ${errors.lastName ? 'error' : ''}`}
                            disabled={createSignupMutation.isPending}
                        />
                        {errors.lastName && <InlineError message={errors.lastName.message || 'Required'} />}
                    </div>
                </div>

                <div>
                    <label className="form-label">Email</label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Please enter a valid email address' }
                        })}
                        type="email"
                        placeholder="john@example.com"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        disabled={createSignupMutation.isPending}
                    />
                    {errors.email && <InlineError message={errors.email.message || 'Invalid email'} />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Password</label>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            type="password"
                            placeholder="Min 8 characters"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            disabled={createSignupMutation.isPending}
                        />
                        {errors.password && <InlineError message={errors.password.message || 'Invalid password'} />}
                    </div>

                    <div>
                        <label className="form-label">Confirm password</label>
                        <input
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                            type="password"
                            placeholder="Confirm password"
                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                            disabled={createSignupMutation.isPending}
                        />
                        {errors.confirmPassword && <InlineError message={errors.confirmPassword.message || 'Passwords must match'} />}
                    </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                    <input
                        {...register('acceptTerms', { required: 'You must accept the terms and conditions' })}
                        type="checkbox"
                        id="acceptTerms"
                        className="mt-1"
                        disabled={createSignupMutation.isPending}
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-600 flex-1">
                        I agree to the terms and privacy policy
                    </label>
                </div>
                {errors.acceptTerms && <InlineError message={errors.acceptTerms.message || 'Required'} />}

                <SubmitButton isLoading={createSignupMutation.isPending} loadingText="Creating account...">
                    Sign up
                </SubmitButton>
            </form>
        </AuthLayout>
    )
}

