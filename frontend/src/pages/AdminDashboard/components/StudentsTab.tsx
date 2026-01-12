import type { Student } from '../../../types'
import { getId } from '../utils/helpers.ts'

interface StudentsTabProps {
    students: Student[]
    searchTerm: string
    setSearchTerm: (term: string) => void
    onDeleteStudent: (studentId: string | number) => void
}

export default function StudentsTab({
    students,
    searchTerm,
    setSearchTerm,
    onDeleteStudent
}: StudentsTabProps) {
    const filteredStudents = students.filter((s: Student) =>
        `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Student Management</h2>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student: Student, index: number) => (
                            <tr key={getId(student)}>
                                <td>{index + 1}</td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.email}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => onDeleteStudent(getId(student)!)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <p className="no-data">No students found</p>
                )}
            </div>
        </div>
    )
}
