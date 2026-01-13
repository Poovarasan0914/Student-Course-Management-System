import { useState } from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: 'Course Management',
            description: 'Easily create, manage, and organize courses with comprehensive tools for curriculum planning and content delivery.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Student Enrollment',
            description: 'Streamlined enrollment process allowing students to browse, select, and enroll in courses with just a few clicks.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Analytics Dashboard',
            description: 'Comprehensive dashboards for students, staff, and admins with real-time insights and progress tracking.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email Notifications',
            description: 'Automated email notifications for registration, enrollment confirmations, and password recovery.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Secure Authentication',
            description: 'Role-based access control with secure login systems for students, staff, and administrators.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Real-time Updates',
            description: 'Instant updates on course availability, enrollment status, and important announcements.'
        }
    ]

    const stats = [
        { value: '10K+', label: 'Active Students' },
        { value: '500+', label: 'Courses Available' },
        { value: '200+', label: 'Expert Instructors' },
        { value: '98%', label: 'Satisfaction Rate' }
    ]

    const userTypes = [
        {
            title: 'Student',
            description: 'Access courses, track progress, and manage your learning journey',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
            ),
            color: 'blue',
            loginPath: '/login',
            signupPath: '/signup'
        },
        {
            title: 'Staff',
            description: 'Create and manage courses, monitor student progress',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: 'green',
            loginPath: '/staff/login',
            signupPath: '/staff/signup'
        },
        {
            title: 'Admin',
            description: 'Full system control, user management, and analytics',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'red',
            loginPath: '/admin/login',
            signupPath: null
        }
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; hover: string; text: string; border: string; light: string }> = {
            blue: {
                bg: 'bg-blue-600',
                hover: 'hover:bg-blue-700',
                text: 'text-blue-600',
                border: 'border-blue-600',
                light: 'bg-blue-50'
            },
            green: {
                bg: 'bg-green-600',
                hover: 'hover:bg-green-700',
                text: 'text-green-600',
                border: 'border-green-600',
                light: 'bg-green-50'
            },
            red: {
                bg: 'bg-red-600',
                hover: 'hover:bg-red-700',
                text: 'text-red-600',
                border: 'border-red-600',
                light: 'bg-red-50'
            }
        }
        return colors[color] || colors.blue
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                                EduManage
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#portals" className="text-gray-600 hover:text-gray-900 transition-colors">Portals</a>
                            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-4 py-2 bg-linear-to-r from-blue-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            <div className="flex flex-col space-y-3">
                                <a href="#features" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                                <a href="#portals" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">Portals</a>
                                <a href="#about" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">About</a>
                                <div className="pt-3 flex flex-col space-y-2">
                                    <Link to="/login" className="px-4 py-2 text-center text-gray-700 border border-gray-300 rounded-lg font-medium">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="px-4 py-2 text-center bg-linear-to-r from-blue-600 to-red-600 text-white rounded-lg font-medium">
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 via-white to-red-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Trusted by 10,000+ Students & Educators
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Transform Your
                            <span className="bg-linear-to-r from-blue-600 to-red-600 bg-clip-text text-transparent"> Educational </span>
                            Experience
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            A comprehensive platform for managing courses, enrollments, and academic progress. Empowering students, staff, and administrators with powerful tools.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-red-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                            >
                                Start Learning Today
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Powerful Features for Modern Education
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage courses, track progress, and enhance the learning experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-red-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Portals Section */}
            <section id="portals" className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Choose Your Portal
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Access the platform based on your role. Each portal is designed with specific features for your needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {userTypes.map((userType, index) => {
                            const colors = getColorClasses(userType.color)
                            return (
                                <div
                                    key={index}
                                    className={`relative p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-${userType.color}-200 hover:shadow-xl transition-all group overflow-hidden`}
                                >
                                    {/* Background decoration */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${colors.light} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`}></div>

                                    <div className={`relative w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 transition-transform`}>
                                        {userType.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{userType.title}</h3>
                                    <p className="text-gray-600 mb-6">{userType.description}</p>

                                    <div className="space-y-3">
                                        <Link
                                            to={userType.loginPath}
                                            className={`block w-full py-3 px-4 ${colors.bg} ${colors.hover} text-white rounded-xl font-semibold text-center transition-all hover:shadow-lg`}
                                        >
                                            Login as {userType.title}
                                        </Link>
                                        {userType.signupPath && (
                                            <Link
                                                to={userType.signupPath}
                                                className={`block w-full py-3 px-4 border-2 ${colors.border} ${colors.text} rounded-xl font-semibold text-center hover:${colors.light} transition-all`}
                                            >
                                                Sign Up
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Designed for the Future of Education
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Our Student Course Management System is built with modern technologies to provide a seamless experience for all users. Whether you're a student looking to enroll in courses, a staff member managing curriculum, or an administrator overseeing the entire platform.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Intuitive and user-friendly interface',
                                    'Real-time data synchronization',
                                    'Secure and reliable infrastructure',
                                    'Responsive design for all devices'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-red-600 rounded-2xl transform rotate-3"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Course Enrolled</div>
                                            <div className="text-sm text-gray-500">Introduction to Web Development</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">New Course Added</div>
                                            <div className="text-sm text-gray-500">Advanced React Patterns</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
                                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Welcome Email Sent</div>
                                            <div className="text-sm text-gray-500">Registration confirmed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-red-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Join thousands of students and educators already using our platform to enhance their educational journey.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">EduManage</span>
                            </div>
                            <p className="text-gray-400 max-w-md">
                                Empowering education through technology. Our platform provides comprehensive tools for students, staff, and administrators.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#portals" className="text-gray-400 hover:text-white transition-colors">Portals</a></li>
                                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Access Portal</h4>
                            <ul className="space-y-2">
                                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Student Login</Link></li>
                                <li><Link to="/staff/login" className="text-gray-400 hover:text-white transition-colors">Staff Login</Link></li>
                                <li><Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} EduManage. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
