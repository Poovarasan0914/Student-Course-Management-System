import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateStaff } from '../hooks/api'
import { SuccessDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { ErrorAlert } from '../components/ui/Toast'
import AuthLayout from '../components/AuthLayout'
import { SubmitButton } from '../components/ui/FormInput'
import type { StaffSignupFormValues } from '../types'

export default function StaffSignup() {
    const navigate = useNavigate()
    const createStaffMutation = useCreateStaff()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<StaffSignupFormValues>()

    const firstNameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (firstNameInputRef.current) {
            firstNameInputRef.current.focus()
        }
    }, [])

    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const password = watch('password', '')

    const onSubmit = async (data: StaffSignupFormValues) => {
        try {
            setErrorMessage('')
            setSuccessMessage('')

            await createStaffMutation.mutateAsync({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                specialization: data.specialization
            })

            setSuccessMessage('Staff account created successfully! Redirecting to login...')
            reset()
            setTimeout(() => navigate('/staff/login'), 1500)
        } catch (error: any) {
            setErrorMessage(error?.message || 'Unable to create account. Please check if the server is running and try again.')
        }
    }

    return (
        <AuthLayout
            title="Create Staff Account"
            badge={{ text: "Staff Portal", color: "green" }}
            linear="green-blue"
            footerLinks={[
                { text: "Already have a staff account?", linkText: "Sign in", to: "/staff/login", color: "green" },
                { text: "", linkText: "Student Signup", to: "/signup", color: "blue" }
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
                        <label className="form-label">First Name</label>
                        <input
                            {...register('firstName', {
                                required: 'First name is required',
                                minLength: { value: 2, message: 'First name must be at least 2 characters' }
                            })}
                            ref={(e) => {
                                register('firstName').ref(e)
                                firstNameInputRef.current = e
                            }}
                            type="text"
                            placeholder="John"
                            className={`form-input ${errors.firstName ? 'error' : ''}`}
                            disabled={createStaffMutation.isPending}
                        />
                        {errors.firstName && <InlineError message={errors.firstName.message || 'Invalid first name'} />}
                    </div>

                    <div>
                        <label className="form-label">Last Name</label>
                        <input
                            {...register('lastName', {
                                required: 'Last name is required',
                                minLength: { value: 1, message: 'Last name is required' }
                            })}
                            type="text"
                            placeholder="Doe"
                            className={`form-input ${errors.lastName ? 'error' : ''}`}
                            disabled={createStaffMutation.isPending}
                        />
                        {errors.lastName && <InlineError message={errors.lastName.message || 'Invalid last name'} />}
                    </div>
                </div>

                <div>
                    <label className="form-label">Email</label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email format' }
                        })}
                        type="email"
                        placeholder="john.doe@staff.com"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        disabled={createStaffMutation.isPending}
                    />
                    {errors.email && <InlineError message={errors.email.message || 'Invalid email'} />}
                </div>

                <div>
                    <label className="form-label">Specialization</label>
                    <input
                        {...register('specialization', {
                            required: 'Specialization is required',
                            minLength: { value: 2, message: 'Specialization must be at least 2 characters' }
                        })}
                        type="text"
                        placeholder="e.g., React Development, JavaScript, Full Stack"
                        className={`form-input ${errors.specialization ? 'error' : ''}`}
                        disabled={createStaffMutation.isPending}
                    />
                    {errors.specialization && <InlineError message={errors.specialization.message || 'Invalid specialization'} />}
                </div>

                <div>
                    <label className="form-label">Password</label>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        type="password"
                        placeholder="Create a password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        disabled={createStaffMutation.isPending}
                    />
                    {errors.password && <InlineError message={errors.password.message || 'Invalid password'} />}
                </div>

                <div>
                    <label className="form-label">Confirm Password</label>
                    <input
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                        })}
                        type="password"
                        placeholder="Confirm your password"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        disabled={createStaffMutation.isPending}
                    />
                    {errors.confirmPassword && <InlineError message={errors.confirmPassword.message || 'Passwords must match'} />}
                </div>

                <SubmitButton isLoading={createStaffMutation.isPending} loadingText="Creating Account..." color="green">
                    Create Staff Account
                </SubmitButton>
            </form>
        </AuthLayout>
    )
}

