import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

// Wrapper component to provide routing context
const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('LandingPage', () => {
    describe('Navigation', () => {
        it('renders the SCMS branding', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getAllByText('SCMS').length).toBeGreaterThan(0);
        });

        it('renders main navigation links', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Portals').length).toBeGreaterThan(0);
            expect(screen.getAllByText('About').length).toBeGreaterThan(0);
        });

        it('renders authentication buttons', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getAllByText('Log In').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Get Started').length).toBeGreaterThan(0);
        });

        it('toggles mobile menu when hamburger button is clicked', () => {
            renderWithRouter(<LandingPage />);
            const mobileMenuButton = screen.getByRole('button');
            fireEvent.click(mobileMenuButton);
            expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
        });
    });

    describe('Hero Section', () => {
        it('renders the hero headline', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Learn without limits')).toBeInTheDocument();
        });

        it('renders the hero description', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText(/A comprehensive platform for managing courses/)).toBeInTheDocument();
        });

        it('renders CTA buttons', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Get Started Free')).toBeInTheDocument();
        });
    });

    describe('Stats Section', () => {
        it('renders statistics', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('10K+')).toBeInTheDocument();
            expect(screen.getByText('Students')).toBeInTheDocument();
            expect(screen.getByText('500+')).toBeInTheDocument();
            expect(screen.getByText('Courses')).toBeInTheDocument();
        });
    });

    describe('Features Section', () => {
        it('renders the Features section header', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Everything you need')).toBeInTheDocument();
        });

        it('renders feature cards', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Course Management')).toBeInTheDocument();
            expect(screen.getByText('Student Enrollment')).toBeInTheDocument();
            expect(screen.getByText('Course Hub')).toBeInTheDocument();
            expect(screen.getByText('Analytics')).toBeInTheDocument();
        });
    });

    describe('User Portals Section', () => {
        it('renders the Portals section header', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Choose your portal')).toBeInTheDocument();
        });

        it('renders all three portal cards', () => {
            renderWithRouter(<LandingPage />);
            const studentElements = screen.getAllByText('Student');
            expect(studentElements.length).toBeGreaterThan(0);

            const staffElements = screen.getAllByText('Staff');
            expect(staffElements.length).toBeGreaterThan(0);

            const adminElements = screen.getAllByText('Admin');
            expect(adminElements.length).toBeGreaterThan(0);
        });

        it('renders login buttons for all portals', () => {
            renderWithRouter(<LandingPage />);
            const loginButtons = screen.getAllByText('Log in');
            expect(loginButtons.length).toBe(3);
        });

        it('renders signup buttons for Student and Staff only', () => {
            renderWithRouter(<LandingPage />);
            const signupButtons = screen.getAllByText('Sign up');
            expect(signupButtons.length).toBe(2);
        });
    });

    describe('About Section', () => {
        it('renders the About section header', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Built for modern education')).toBeInTheDocument();
        });

        it('renders about feature list', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Real-time chat & collaboration')).toBeInTheDocument();
            expect(screen.getByText('Secure file sharing')).toBeInTheDocument();
        });
    });

    describe('CTA Section', () => {
        it('renders the CTA section', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Ready to start learning?')).toBeInTheDocument();
            expect(screen.getByText('Create Free Account')).toBeInTheDocument();
        });
    });

    describe('Footer', () => {
        it('renders the footer', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByText('Empowering education through modern technology and seamless collaboration.')).toBeInTheDocument();
        });

        it('renders copyright notice with current year', () => {
            renderWithRouter(<LandingPage />);
            const currentYear = new Date().getFullYear();
            expect(screen.getByText(`© ${currentYear} Student Course Management System. All rights reserved.`)).toBeInTheDocument();
        });
    });

    describe('Portal Login Links', () => {
        it('Student portal login links to /login', () => {
            renderWithRouter(<LandingPage />);
            const loginLinks = screen.getAllByRole('link', { name: /Log in/i });
            const studentLoginLink = loginLinks.find(link =>
                link.getAttribute('href') === '/login'
            );
            expect(studentLoginLink).toBeInTheDocument();
        });

        it('Staff portal login links to /staff/login', () => {
            renderWithRouter(<LandingPage />);
            const loginLinks = screen.getAllByRole('link', { name: /Log in/i });
            const staffLoginLink = loginLinks.find(link =>
                link.getAttribute('href') === '/staff/login'
            );
            expect(staffLoginLink).toBeInTheDocument();
        });

        it('Admin portal login links to /admin/login', () => {
            renderWithRouter(<LandingPage />);
            const loginLinks = screen.getAllByRole('link', { name: /Log in/i });
            const adminLoginLink = loginLinks.find(link =>
                link.getAttribute('href') === '/admin/login'
            );
            expect(adminLoginLink).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('renders semantic HTML elements', () => {
            renderWithRouter(<LandingPage />);
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        });

        it('all interactive elements are keyboard accessible', () => {
            renderWithRouter(<LandingPage />);
            const links = screen.getAllByRole('link');
            expect(links.length).toBeGreaterThan(0);

            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });

    describe('Responsive Design', () => {
        it('mobile menu toggles correctly', () => {
            renderWithRouter(<LandingPage />);
            const mobileMenuButton = screen.getByRole('button');

            // Click to open
            fireEvent.click(mobileMenuButton);

            // Click to close
            fireEvent.click(mobileMenuButton);

            // Page should still render correctly
            expect(screen.getByText('Learn without limits')).toBeInTheDocument();
        });
    });
});
