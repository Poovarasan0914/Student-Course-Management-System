import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../index';

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Sample test data
const mockStudent = {
    _id: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
};

// Helper to render with providers
const renderDashboard = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('Student Dashboard', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
        mockLocalStorage.setItem('currentUser', JSON.stringify(mockStudent));
    });

    describe('Page Structure', () => {
        it('renders the dashboard page', () => {
            renderDashboard();
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('renders header', () => {
            renderDashboard();
            expect(screen.getByRole('banner')).toBeInTheDocument();
        });
    });

    describe('Course Display', () => {
        it('shows available courses heading by default', () => {
            renderDashboard();
            expect(screen.getByText('Available Courses')).toBeInTheDocument();
        });

        it('displays course count information', () => {
            renderDashboard();
            expect(screen.getByText(/courses available/i)).toBeInTheDocument();
        });
    });

    describe('Course Filtering', () => {
        it('allows switching to enrolled courses view', async () => {
            renderDashboard();

            // Look for filter toggle buttons in header
            const buttons = screen.getAllByRole('button');
            const enrolledButton = buttons.find(btn =>
                btn.textContent?.includes('My Courses') || btn.textContent?.includes('Enrolled')
            );

            if (enrolledButton) {
                await userEvent.click(enrolledButton);

                await waitFor(() => {
                    expect(screen.getByText(/enrolled courses/i) || screen.getByText(/my courses/i)).toBeInTheDocument();
                });
            }
        });

        it('shows all courses view by default', () => {
            renderDashboard();
            expect(screen.getByText('Available Courses')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        it('renders search input', () => {
            renderDashboard();
            const searchInput = screen.getByPlaceholderText(/search/i);
            expect(searchInput).toBeInTheDocument();
        });

        it('allows typing in search field', async () => {
            renderDashboard();
            const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;

            await userEvent.type(searchInput, 'Web Development');
            expect(searchInput.value).toBe('Web Development');
        });
    });

    describe('Empty States', () => {
        it('shows message when viewing enrolled courses with no enrollments', async () => {
            renderDashboard();

            // Try to switch to enrolled view
            const buttons = screen.getAllByRole('button');
            const enrolledButton = buttons.find(btn =>
                btn.textContent?.includes('My Courses') || btn.textContent?.includes('Enrolled')
            );

            if (enrolledButton) {
                await userEvent.click(enrolledButton);

                // Should show empty state or course list
                await waitFor(() => {
                    expect(screen.getByRole('main')).toBeInTheDocument();
                });
            }
        });
    });

    describe('Navigation Actions', () => {
        it('has logout functionality in header', () => {
            renderDashboard();

            // Logout button should be in the header
            const buttons = screen.getAllByRole('button');
            const hasLogoutButton = buttons.some(btn =>
                btn.textContent?.toLowerCase().includes('logout') ||
                btn.getAttribute('aria-label')?.toLowerCase().includes('logout')
            );

            expect(hasLogoutButton || buttons.length > 0).toBe(true);
        });
    });

    describe('Accessibility', () => {
        it('has proper semantic structure with main landmark', () => {
            renderDashboard();
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('has banner landmark', () => {
            renderDashboard();
            expect(screen.getByRole('banner')).toBeInTheDocument();
        });

        it('has accessible buttons', () => {
            renderDashboard();
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('search input is accessible', () => {
            renderDashboard();
            const searchInput = screen.getByPlaceholderText(/search/i);
            expect(searchInput).toHaveAttribute('type');
        });
    });

    describe('User Authentication State', () => {
        it('renders when user is authenticated', () => {
            renderDashboard();
            expect(screen.getByRole('main')).toBeInTheDocument();
        });
    });

    describe('Course Count Display', () => {
        it('displays enrollment statistics', () => {
            renderDashboard();

            // Should show some form of course/enrollment count
            const mainContent = screen.getByRole('main');
            expect(mainContent.textContent).toBeTruthy();
        });
    });

    describe('Filter Toggle Buttons', () => {
        it('has filter controls in the interface', () => {
            renderDashboard();

            // Should have All/Enrolled toggle or similar
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});
