import type { Student, Staff, Course, Enrollment, TabType } from '../../../types'
import { getId, getStudentName, getCourseName } from '../utils/helpers.ts'

interface DashboardOverviewProps {
    students: Student[]
    staff: Staff[]
    courses: Course[]
    enrollments: Enrollment[]
    setActiveTab: (tab: TabType) => void
    onAddAdmin: () => void
}

export default function DashboardOverview({
    students,
    staff,
    courses,
    enrollments,
    setActiveTab,
    onAddAdmin
}: DashboardOverviewProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="bi-mortarboard" color="blue" value={students.length} label="Total Students" />
                <StatCard icon="bi-person-circle" color="green" value={staff.length} label="Total Staff" />
                <StatCard icon="bi-book" color="amber" value={courses.length} label="Total Courses" />
                <StatCard icon="bi-journal-check" color="red" value={enrollments.length} label="Total Enrollments" />
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton
                        icon="bi-mortarboard"
                        color="blue"
                        label="Manage Students"
                        onClick={() => setActiveTab('students')}
                    />
                    <QuickActionButton
                        icon="bi-person-circle"
                        color="green"
                        label="Manage Staff"
                        onClick={() => setActiveTab('staff')}
                    />
                    <QuickActionButton
                        icon="bi-book"
                        color="amber"
                        label="Manage Courses"
                        onClick={() => setActiveTab('courses')}
                    />
                    <QuickActionButton
                        icon="bi-plus-circle"
                        color="red"
                        label="Add New Admin"
                        onClick={onAddAdmin}
                    />
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
                <RecentEnrollments
                    enrollments={enrollments}
                    students={students}
                    courses={courses}
                />
                <PopularCourses
                    courses={courses}
                    enrollments={enrollments}
                />
                <CourseLevelDistribution courses={courses} />
                <TopInstructors
                    staff={staff}
                    courses={courses}
                />
            </div>
        </div>
    )
}

// Sub-components
interface StatCardProps {
    icon: string
    color: 'blue' | 'green' | 'amber' | 'red'
    value: number
    label: string
}

function StatCard({ icon, color, value, label }: StatCardProps) {
    const colorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        amber: 'text-amber-500',
        red: 'text-red-600'
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <span className={`text-4xl ${colorClasses[color]}`}>
                    <i className={`bi ${icon}`}></i>
                </span>
                <div>
                    <h3 className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</h3>
                    <p className="text-gray-500">{label}</p>
                </div>
            </div>
        </div>
    )
}

interface QuickActionButtonProps {
    icon: string
    color: 'blue' | 'green' | 'amber' | 'red'
    label: string
    onClick: () => void
}

function QuickActionButton({ icon, color, label, onClick }: QuickActionButtonProps) {
    const colorClasses = {
        blue: 'text-blue-600 hover:border-blue-200',
        green: 'text-green-600 hover:border-green-200',
        amber: 'text-amber-500 hover:border-amber-200',
        red: 'text-red-600 hover:border-red-200'
    }

    return (
        <button
            className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 ${colorClasses[color]}`}
            onClick={onClick}
        >
            <span className={`text-3xl ${colorClasses[color].split(' ')[0]}`}>
                <i className={`bi ${icon}`}></i>
            </span>
            <span className="text-gray-700 font-medium">{label}</span>
        </button>
    )
}

interface RecentEnrollmentsProps {
    enrollments: Enrollment[]
    students: Student[]
    courses: Course[]
}

function RecentEnrollments({ enrollments, students, courses }: RecentEnrollmentsProps) {
    return (
        <div className="dashboard-card">
            <h3><i className="bi bi-journal-check me-2"></i>Recent Enrollments</h3>
            {enrollments.length === 0 ? (
                <p className="no-data-small">No enrollments yet</p>
            ) : (
                <ul className="recent-list">
                    {enrollments.slice(-5).reverse().map((enrollment: Enrollment) => (
                        <li key={enrollment.id} className="recent-item">
                            <div className="recent-item-info">
                                <span className="recent-item-title">
                                    {getStudentName(enrollment.studentId, students)}
                                </span>
                                <span className="recent-item-sub">
                                    enrolled in {getCourseName(enrollment.courseId, courses)}
                                </span>
                            </div>
                            <span className="recent-item-date">
                                {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

interface PopularCoursesProps {
    courses: Course[]
    enrollments: Enrollment[]
}

function PopularCourses({ courses, enrollments }: PopularCoursesProps) {
    const coursesWithEnrollments = courses
        .map((course: Course) => ({
            ...course,
            enrollmentCount: enrollments.filter((e: Enrollment) => String(e.courseId) === String(getId(course))).length
        }))
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 5)

    return (
        <div className="dashboard-card">
            <h3><i className="bi bi-fire me-2"></i>Popular Courses</h3>
            {courses.length === 0 ? (
                <p className="no-data-small">No courses yet</p>
            ) : (
                <ul className="recent-list">
                    {coursesWithEnrollments.map((course) => (
                        <li key={getId(course)} className="recent-item">
                            <div className="recent-item-info">
                                <span className="recent-item-title">{course.title}</span>
                                <span className="recent-item-sub">by {course.instructor}</span>
                            </div>
                            <span className="enrollment-badge">
                                {course.enrollmentCount} enrolled
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

interface CourseLevelDistributionProps {
    courses: Course[]
}

function CourseLevelDistribution({ courses }: CourseLevelDistributionProps) {
    const getLevelPercentage = (level: string) => {
        if (courses.length === 0) return 0
        return (courses.filter((c: Course) => c.level === level).length / courses.length) * 100
    }

    const getLevelCount = (level: string) => {
        return courses.filter((c: Course) => c.level === level).length
    }

    return (
        <div className="dashboard-card">
            <h3><i className="bi bi-bar-chart me-2"></i>Course Levels</h3>
            <div className="level-distribution">
                <LevelBar level="Beginner" percentage={getLevelPercentage('Beginner')} count={getLevelCount('Beginner')} />
                <LevelBar level="Intermediate" percentage={getLevelPercentage('Intermediate')} count={getLevelCount('Intermediate')} />
                <LevelBar level="Advanced" percentage={getLevelPercentage('Advanced')} count={getLevelCount('Advanced')} />
            </div>
        </div>
    )
}

interface LevelBarProps {
    level: string
    percentage: number
    count: number
}

function LevelBar({ level, percentage, count }: LevelBarProps) {
    return (
        <div className="level-item">
            <div className="level-bar-container">
                <div
                    className={`level-bar ${level.toLowerCase()}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="level-info">
                <span className="level-name">{level}</span>
                <span className="level-count">{count}</span>
            </div>
        </div>
    )
}

interface TopInstructorsProps {
    staff: Staff[]
    courses: Course[]
}

function TopInstructors({ staff, courses }: TopInstructorsProps) {
    const staffWithCourseCount = staff
        .map((s: Staff) => ({
            ...s,
            courseCount: courses.filter((c: Course) => c.instructor === `${s.firstName} ${s.lastName}`).length
        }))
        .sort((a, b) => b.courseCount - a.courseCount)
        .slice(0, 5)

    return (
        <div className="dashboard-card">
            <h3><i className="bi bi-star me-2"></i>Top Instructors</h3>
            {staff.length === 0 ? (
                <p className="no-data-small">No staff yet</p>
            ) : (
                <ul className="recent-list">
                    {staffWithCourseCount.map((s) => (
                        <li key={getId(s)} className="recent-item">
                            <div className="recent-item-info">
                                <span className="recent-item-title">{s.firstName} {s.lastName}</span>
                                <span className="recent-item-sub">{s.email}</span>
                            </div>
                            <span className="course-badge">
                                {s.courseCount} courses
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
