import type { Staff } from '../../../types'
import { getId } from '../utils/helpers.ts'

interface StaffTabProps {
    staff: Staff[]
    searchTerm: string
    setSearchTerm: (term: string) => void
    onDeleteStaff: (staffId: string | number) => void
}

export default function StaffTab({
    staff,
    searchTerm,
    setSearchTerm,
    onDeleteStaff
}: StaffTabProps) {
    const filteredStaff = staff.filter((s: Staff) => {
        const matchesSearch = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Staff Management</h2>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search staff..."
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
                        {filteredStaff.map((s: Staff, index: number) => (
                            <tr key={getId(s)}>
                                <td>{index + 1}</td>
                                <td>{s.firstName} {s.lastName}</td>
                                <td>{s.email}</td>
                                <td className="action-buttons">
                                    <button
                                        className="delete-btn"
                                        onClick={() => onDeleteStaff(getId(s)!)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStaff.length === 0 && (
                    <p className="no-data">No staff found</p>
                )}
            </div>
        </div>
    )
}
