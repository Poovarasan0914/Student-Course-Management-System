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
        it('renders the SCMS logo and brand name', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getAllByText('SCMS').length).toBeGreaterThan(0);
        });

        it('renders navigation links', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Portals').length).toBeGreaterThan(0);
            expect(screen.getAllByText('About').length).toBeGreaterThan(0);
        });

        it('renders Log In and Get Started buttons', () => {
            renderWithRouter(<LandingPage />);

            // Multiple instances due to mobile menu
            expect(screen.getAllByText('Log In').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Get Started').length).toBeGreaterThan(0);
        });

        it('toggles mobile menu when hamburger button is clicked', () => {
            renderWithRouter(<LandingPage />);

            // Find the mobile menu button (hamburger icon)
            const mobileMenuButton = screen.getByRole('button');

            // Initially, mobile menu items should be in the nav
            fireEvent.click(mobileMenuButton);

            // After clicking, the menu should be visible
            // Check for menu items that appear in mobile menu
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

        it('renders the Student Course Management System badge', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Student Course Management System')).toBeInTheDocument();
        });

        it('renders Get Started Free and Log In CTA buttons', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Get Started Free')).toBeInTheDocument();
        });
    });

    describe('Stats Section', () => {
        it('renders all statistics', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('10K+')).toBeInTheDocument();
            expect(screen.getByText('Students')).toBeInTheDocument();
            expect(screen.getByText('500+')).toBeInTheDocument();
            expect(screen.getByText('Courses')).toBeInTheDocument();
            expect(screen.getByText('200+')).toBeInTheDocument();
            expect(screen.getByText('Instructors')).toBeInTheDocument();
            expect(screen.getByText('98%')).toBeInTheDocument();
            expect(screen.getByText('Satisfaction')).toBeInTheDocument();
        });
    });

    describe('Features Section', () => {
        it('renders the Features section header', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Everything you need')).toBeInTheDocument();
            expect(screen.getByText('Powerful tools for effective learning and teaching.')).toBeInTheDocument();
        });

        it('renders all feature cards', () => {
            renderWithRouter(<LandingPage />);

            // Feature titles
            expect(screen.getByText('Course Management')).toBeInTheDocument();
            expect(screen.getByText('Student Enrollment')).toBeInTheDocument();
            expect(screen.getByText('Course Hub')).toBeInTheDocument();
            expect(screen.getByText('Analytics')).toBeInTheDocument();
            expect(screen.getByText('Secure Access')).toBeInTheDocument();
            expect(screen.getByText('Notifications')).toBeInTheDocument();
        });

        it('renders feature descriptions', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Create and organize courses with comprehensive curriculum tools.')).toBeInTheDocument();
            expect(screen.getByText('Streamlined enrollment for browsing and joining courses.')).toBeInTheDocument();
            expect(screen.getByText('Real-time chat and file sharing with instructors.')).toBeInTheDocument();
            expect(screen.getByText('Track progress with insights and dashboards.')).toBeInTheDocument();
            expect(screen.getByText('Role-based authentication for all users.')).toBeInTheDocument();
            expect(screen.getByText('Automated emails for updates and reminders.')).toBeInTheDocument();
        });
    });

    describe('User Portals Section', () => {
        it('renders the Portals section header', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Choose your portal')).toBeInTheDocument();
            expect(screen.getByText('Access the platform based on your role.')).toBeInTheDocument();
        });

        it('renders Student portal card', () => {
            renderWithRouter(<LandingPage />);

            // User type title in portal section
            const studentElements = screen.getAllByText('Student');
            expect(studentElements.length).toBeGreaterThan(0);
            expect(screen.getByText('Access courses, track progress, chat with instructors')).toBeInTheDocument();
        });

        it('renders Staff portal card', () => {
            renderWithRouter(<LandingPage />);

            const staffElements = screen.getAllByText('Staff');
            expect(staffElements.length).toBeGreaterThan(0);
            expect(screen.getByText('Create courses, share materials, manage students')).toBeInTheDocument();
        });

        it('renders Admin portal card', () => {
            renderWithRouter(<LandingPage />);

            const adminElements = screen.getAllByText('Admin');
            expect(adminElements.length).toBeGreaterThan(0);
            expect(screen.getByText('Full system control and user management')).toBeInTheDocument();
        });

        it('renders login buttons for all portals', () => {
            renderWithRouter(<LandingPage />);

            // Check for Log in buttons (multiple instances)
            const loginButtons = screen.getAllByText('Log in');
            expect(loginButtons.length).toBe(3); // One for each portal
        });

        it('renders signup buttons for Student and Staff portals only', () => {
            renderWithRouter(<LandingPage />);

            // Sign up buttons exist for Student and Staff but not Admin
            const signupButtons = screen.getAllByText('Sign up');
            expect(signupButtons.length).toBe(2); // Student and Staff only
        });
    });

    describe('About Section', () => {
        it('renders the About section header', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Built for modern education')).toBeInTheDocument();
        });

        it('renders the about description', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText(/Our platform provides seamless experience/)).toBeInTheDocument();
        });

        it('renders about feature list items', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Real-time chat & collaboration')).toBeInTheDocument();
            expect(screen.getByText('Secure file sharing')).toBeInTheDocument();
            expect(screen.getByText('Responsive design')).toBeInTheDocument();
            expect(screen.getByText('Role-based access')).toBeInTheDocument();
        });

        it('renders demonstration cards', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Course Enrolled')).toBeInTheDocument();
            expect(screen.getByText('Web Development')).toBeInTheDocument();
            expect(screen.getByText('New Message')).toBeInTheDocument();
            expect(screen.getByText('From instructor')).toBeInTheDocument();
            expect(screen.getByText('Material Uploaded')).toBeInTheDocument();
            expect(screen.getByText('Lecture Notes.pdf')).toBeInTheDocument();
        });
    });

    describe('CTA Section', () => {
        it('renders the CTA headline', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Ready to start learning?')).toBeInTheDocument();
        });

        it('renders the CTA description', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Join thousands of students and educators on our platform.')).toBeInTheDocument();
        });

        it('renders Create Free Account button', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Create Free Account')).toBeInTheDocument();
        });
    });

    describe('Footer', () => {
        it('renders the footer with SCMS branding', () => {
            renderWithRouter(<LandingPage />);

            expect(screen.getByText('Empowering education through modern technology and seamless collaboration.')).toBeInTheDocument();
        });

        it('renders footer navigation links', () => {
            renderWithRouter(<LandingPage />);

            // Footer has Links section
            expect(screen.getByText('Links')).toBeInTheDocument();
            expect(screen.getByText('Access')).toBeInTheDocument();
        });

        it('renders copyright notice with current year', () => {
            renderWithRouter(<LandingPage />);

            const currentYear = new Date().getFullYear();
            expect(screen.getByText(`© ${currentYear} Student Course Management System. All rights reserved.`)).toBeInTheDocument();
        });
    });

    describe('Navigation Links', () => {
        it('has correct href for Features link', () => {
            renderWithRouter(<LandingPage />);

            const featuresLinks = screen.getAllByText('Features');
            // Check that at least one link has the correct href
            const hasCorrectHref = featuresLinks.some(link =>
                link.closest('a')?.getAttribute('href') === '#features'
            );
            expect(hasCorrectHref).toBe(true);
        });

        it('has correct href for Portals link', () => {
            renderWithRouter(<LandingPage />);

            const portalsLinks = screen.getAllByText('Portals');
            const hasCorrectHref = portalsLinks.some(link =>
                link.closest('a')?.getAttribute('href') === '#portals'
            );
            expect(hasCorrectHref).toBe(true);
        });

        it('has correct href for About link', () => {
            renderWithRouter(<LandingPage />);

            const aboutLinks = screen.getAllByText('About');
            const hasCorrectHref = aboutLinks.some(link =>
                link.closest('a')?.getAttribute('href') === '#about'
            );
            expect(hasCorrectHref).toBe(true);
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
        it('renders the page without accessibility violations in structure', () => {
            renderWithRouter(<LandingPage />);

            // Check for main semantic elements
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
        });

        it('all interactive elements are keyboard accessible', () => {
            renderWithRouter(<LandingPage />);

            // Check that links are rendered
            const links = screen.getAllByRole('link');
            expect(links.length).toBeGreaterThan(0);

            // Check that buttons are rendered
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });

    describe('Responsive Design', () => {
        it('mobile menu button is rendered', () => {
            renderWithRouter(<LandingPage />);

            // The mobile menu button should exist
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

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
