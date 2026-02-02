import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from '../Signup';

// Create a fresh QueryClient for each test
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
    }
});

// Wrapper component to provide required providers
const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {component}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('Signup Page', () => {
    describe('Page Structure', () => {
        it('renders the signup page with title', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByText('Create an account')).toBeInTheDocument();
        });

        it('renders all required form fields', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Min 8 characters')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
        });

        it('renders form labels', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByText('First name')).toBeInTheDocument();
            expect(screen.getByText('Last name')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Password')).toBeInTheDocument();
            expect(screen.getByText('Confirm password')).toBeInTheDocument();
        });

        it('renders terms and conditions checkbox', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByLabelText(/I agree to the terms and privacy policy/i)).toBeInTheDocument();
        });

        it('renders the submit button', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
        });
    });

    describe('Navigation Links', () => {
        it('renders link to login page', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByText('Already have an account?')).toBeInTheDocument();
            expect(screen.getByText('Sign in')).toBeInTheDocument();
        });

        it('renders link to staff signup page', () => {
            renderWithProviders(<Signup />);
            expect(screen.getByText('Register as Staff')).toBeInTheDocument();
        });

        it('login link has correct href', () => {
            renderWithProviders(<Signup />);
            const signInLink = screen.getByText('Sign in');
            expect(signInLink.closest('a')).toHaveAttribute('href', '/login');
        });

        it('staff signup link has correct href', () => {
            renderWithProviders(<Signup />);
            const staffSignupLink = screen.getByText('Register as Staff');
            expect(staffSignupLink.closest('a')).toHaveAttribute('href', '/staff/signup');
        });
    });

    describe('Form Input Types', () => {
        it('password field has type password', () => {
            renderWithProviders(<Signup />);
            const passwordInput = screen.getByPlaceholderText('Min 8 characters');
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('confirm password field has type password', () => {
            renderWithProviders(<Signup />);
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
            expect(confirmPasswordInput).toHaveAttribute('type', 'password');
        });

        it('email field has type email', () => {
            renderWithProviders(<Signup />);
            const emailInput = screen.getByPlaceholderText('john@example.com');
            expect(emailInput).toHaveAttribute('type', 'email');
        });
    });

    describe('Form Validation', () => {
        it('shows error when first name is empty', async () => {
            renderWithProviders(<Signup />);
            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('First name is required')).toBeInTheDocument();
            });
        });

        it('shows error when last name is empty', async () => {
            renderWithProviders(<Signup />);
            const firstNameInput = screen.getByPlaceholderText('John');
            await userEvent.type(firstNameInput, 'Test');

            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Last name is required')).toBeInTheDocument();
            });
        });

        it('shows error when email format is invalid', async () => {
            renderWithProviders(<Signup />);
            const emailInput = screen.getByPlaceholderText('john@example.com');
            await userEvent.type(emailInput, 'invalidemail');

            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            });
        });

        it('shows error when password is too short', async () => {
            renderWithProviders(<Signup />);
            const passwordInput = screen.getByPlaceholderText('Min 8 characters');
            await userEvent.type(passwordInput, 'short');

            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
            });
        });

        it('shows error when passwords do not match', async () => {
            renderWithProviders(<Signup />);
            const passwordInput = screen.getByPlaceholderText('Min 8 characters');
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

            await userEvent.type(passwordInput, 'password123');
            await userEvent.type(confirmPasswordInput, 'differentpassword');

            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
            });
        });

        it('shows error when terms are not accepted', async () => {
            renderWithProviders(<Signup />);
            const firstNameInput = screen.getByPlaceholderText('John');
            const lastNameInput = screen.getByPlaceholderText('Doe');
            const emailInput = screen.getByPlaceholderText('john@example.com');
            const passwordInput = screen.getByPlaceholderText('Min 8 characters');
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

            await userEvent.type(firstNameInput, 'Test');
            await userEvent.type(lastNameInput, 'User');
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, 'password123');
            await userEvent.type(confirmPasswordInput, 'password123');

            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
            });
        });
    });

    describe('Form Input', () => {
        it('allows typing in first name field', async () => {
            renderWithProviders(<Signup />);
            const firstNameInput = screen.getByPlaceholderText('John') as HTMLInputElement;
            await userEvent.type(firstNameInput, 'TestFirstName');
            expect(firstNameInput.value).toBe('TestFirstName');
        });

        it('allows typing in email field', async () => {
            renderWithProviders(<Signup />);
            const emailInput = screen.getByPlaceholderText('john@example.com') as HTMLInputElement;
            await userEvent.type(emailInput, 'test@example.com');
            expect(emailInput.value).toBe('test@example.com');
        });

        it('allows checking terms and conditions checkbox', async () => {
            renderWithProviders(<Signup />);
            const checkbox = screen.getByLabelText(/I agree to the terms and privacy policy/i) as HTMLInputElement;
            await userEvent.click(checkbox);
            expect(checkbox.checked).toBe(true);
        });
    });

    describe('Accessibility', () => {
        it('checkbox has associated label', () => {
            renderWithProviders(<Signup />);
            const checkbox = screen.getByLabelText(/I agree to the terms and privacy policy/i);
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).toHaveAttribute('type', 'checkbox');
        });

        it('submit button is accessible', () => {
            renderWithProviders(<Signup />);
            const submitButton = screen.getByRole('button', { name: /sign up/i });
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveAttribute('type', 'submit');
        });

        it('error messages are visible after validation fails', async () => {
            renderWithProviders(<Signup />);
            const submitButton = screen.getByRole('button', { name: /sign up/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText('First name is required');
                expect(errorMessage).toBeInTheDocument();
            });
        });
    });
});
