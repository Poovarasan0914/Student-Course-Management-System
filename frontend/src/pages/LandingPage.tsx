import { useState } from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const features = [
        {
            icon: 'bi-book',
            title: 'Course Management',
            description: 'Create and organize courses with comprehensive curriculum tools.'
        },
        {
            icon: 'bi-people',
            title: 'Student Enrollment',
            description: 'Streamlined enrollment for browsing and joining courses.'
        },
        {
            icon: 'bi-chat-dots',
            title: 'Course Hub',
            description: 'Real-time chat and file sharing with instructors.'
        },
        {
            icon: 'bi-graph-up',
            title: 'Analytics',
            description: 'Track progress with insights and dashboards.'
        },
        {
            icon: 'bi-shield-check',
            title: 'Secure Access',
            description: 'Role-based authentication for all users.'
        },
        {
            icon: 'bi-bell',
            title: 'Notifications',
            description: 'Automated emails for updates and reminders.'
        }
    ]

    const stats = [
        { value: '10K+', label: 'Students' },
        { value: '500+', label: 'Courses' },
        { value: '200+', label: 'Instructors' },
        { value: '98%', label: 'Satisfaction' }
    ]

    const userTypes = [
        {
            title: 'Student',
            icon: 'bi-mortarboard',
            description: 'Access courses, track progress, chat with instructors',
            loginPath: '/login',
            signupPath: '/signup'
        },
        {
            title: 'Staff',
            icon: 'bi-person-badge',
            description: 'Create courses, share materials, manage students',
            loginPath: '/staff/login',
            signupPath: '/staff/signup'
        },
        {
            title: 'Admin',
            icon: 'bi-shield-lock',
            description: 'Full system control and user management',
            loginPath: '/admin/login',
            signupPath: null
        }
    ]

    return (
        <div className="min-h-screen bg-bg">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <i className="bi bi-mortarboard-fill text-white text-lg"></i>
                            </div>
                            <span className="text-lg font-bold text-text">SCMS</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-text-secondary hover:text-text text-sm font-medium transition-colors">Features</a>
                            <a href="#portals" className="text-text-secondary hover:text-text text-sm font-medium transition-colors">Portals</a>
                            <a href="#about" className="text-text-secondary hover:text-text text-sm font-medium transition-colors">About</a>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="px-4 py-2 text-text-secondary hover:text-text text-sm font-medium transition-colors">
                                Log In
                            </Link>
                            <Link to="/signup" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2.5 rounded-xl hover:bg-surface-hover transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl text-text`}></i>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-border">
                            <div className="flex flex-col gap-2">
                                <a href="#features" className="px-4 py-2.5 text-text-secondary hover:text-text hover:bg-surface-hover rounded-xl text-sm font-medium transition-all">Features</a>
                                <a href="#portals" className="px-4 py-2.5 text-text-secondary hover:text-text hover:bg-surface-hover rounded-xl text-sm font-medium transition-all">Portals</a>
                                <a href="#about" className="px-4 py-2.5 text-text-secondary hover:text-text hover:bg-surface-hover rounded-xl text-sm font-medium transition-all">About</a>
                                <div className="pt-3 flex flex-col gap-2">
                                    <Link to="/login" className="px-4 py-2.5 text-center text-text border border-border rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="px-4 py-2.5 text-center bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-6">
                        <i className="bi bi-stars"></i>
                        <span>Student Course Management System</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-text mb-6 leading-tight">
                        Learn without limits
                    </h1>
                    <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                        A comprehensive platform for managing courses, enrollments, and academic progress with modern tools.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
                        >
                            <i className="bi bi-rocket-takeoff me-2"></i>
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3.5 bg-surface border border-border text-text rounded-xl font-medium hover:bg-surface-hover transition-colors"
                        >
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Log In
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-surface rounded-2xl p-6 text-center border border-border shadow-sm">
                                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                <div className="text-text-secondary text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full text-accent text-xs font-medium mb-4">
                            <i className="bi bi-lightning-charge-fill"></i>
                            FEATURES
                        </div>
                        <h2 className="text-3xl font-bold text-text mb-4">
                            Everything you need
                        </h2>
                        <p className="text-text-secondary max-w-lg mx-auto">
                            Powerful tools for effective learning and teaching.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-surface rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary text-xl mb-4">
                                    <i className={`bi ${feature.icon}`}></i>
                                </div>
                                <h3 className="text-base font-semibold text-text mb-2">{feature.title}</h3>
                                <p className="text-text-secondary text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Portals Section */}
            <section id="portals" className="py-20 px-4 sm:px-6 bg-surface">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light rounded-full text-primary text-xs font-medium mb-4">
                            <i className="bi bi-door-open-fill"></i>
                            PORTALS
                        </div>
                        <h2 className="text-3xl font-bold text-text mb-4">
                            Choose your portal
                        </h2>
                        <p className="text-text-secondary max-w-lg mx-auto">
                            Access the platform based on your role.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {userTypes.map((userType, index) => (
                            <div
                                key={index}
                                className="p-6 bg-bg rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                            >
                                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl mb-5">
                                    <i className={`bi ${userType.icon}`}></i>
                                </div>
                                <h3 className="text-lg font-semibold text-text mb-2">{userType.title}</h3>
                                <p className="text-text-secondary text-sm mb-6">{userType.description}</p>

                                <div className="space-y-3">
                                    <Link
                                        to={userType.loginPath}
                                        className="block w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium text-center text-sm transition-colors"
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Log in
                                    </Link>
                                    {userType.signupPath && (
                                        <Link
                                            to={userType.signupPath}
                                            className="block w-full py-3 px-4 border border-border text-text rounded-xl font-medium text-center text-sm hover:bg-surface-hover transition-colors"
                                        >
                                            <i className="bi bi-person-plus me-2"></i>
                                            Sign up
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full text-accent text-xs font-medium mb-4">
                                <i className="bi bi-info-circle-fill"></i>
                                ABOUT
                            </div>
                            <h2 className="text-3xl font-bold text-text mb-6">
                                Built for modern education
                            </h2>
                            <p className="text-text-secondary mb-8">
                                Our platform provides seamless experience for students, staff, and administrators with cutting-edge technology.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { icon: 'bi-chat-dots-fill', text: 'Real-time chat & collaboration' },
                                    { icon: 'bi-cloud-upload-fill', text: 'Secure file sharing' },
                                    { icon: 'bi-phone-fill', text: 'Responsive design' },
                                    { icon: 'bi-shield-lock-fill', text: 'Role-based access' }
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-text">
                                        <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center text-accent">
                                            <i className={`bi ${item.icon}`}></i>
                                        </div>
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                            <div className="space-y-4">
                                {[
                                    { emoji: '📚', title: 'Course Enrolled', sub: 'Web Development' },
                                    { emoji: '💬', title: 'New Message', sub: 'From instructor' },
                                    { emoji: '📁', title: 'Material Uploaded', sub: 'Lecture Notes.pdf' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-bg rounded-xl">
                                        <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-lg">
                                            {item.emoji}
                                        </div>
                                        <div>
                                            <div className="font-medium text-text text-sm">{item.title}</div>
                                            <div className="text-xs text-text-muted">{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 bg-linear-to-br from-primary to-primary-dark">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to start learning?
                    </h2>
                    <p className="text-white/70 mb-8">
                        Join thousands of students and educators on our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary rounded-xl font-medium hover:bg-white/90 transition-colors shadow-md"
                        >
                            <i className="bi bi-rocket-takeoff me-2"></i>
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 bg-text">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                    <i className="bi bi-mortarboard-fill text-white text-lg"></i>
                                </div>
                                <span className="text-lg font-bold text-white">SCMS</span>
                            </div>
                            <p className="text-text-muted text-sm max-w-xs">
                                Empowering education through modern technology and seamless collaboration.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-text-muted hover:text-white text-sm transition-colors">Features</a></li>
                                <li><a href="#portals" className="text-text-muted hover:text-white text-sm transition-colors">Portals</a></li>
                                <li><a href="#about" className="text-text-muted hover:text-white text-sm transition-colors">About</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Access</h4>
                            <ul className="space-y-2">
                                <li><Link to="/login" className="text-text-muted hover:text-white text-sm transition-colors">Student</Link></li>
                                <li><Link to="/staff/login" className="text-text-muted hover:text-white text-sm transition-colors">Staff</Link></li>
                                <li><Link to="/admin/login" className="text-text-muted hover:text-white text-sm transition-colors">Admin</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/10 text-center">
                        <p className="text-text-muted text-sm">
                            © {new Date().getFullYear()} Student Course Management System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
