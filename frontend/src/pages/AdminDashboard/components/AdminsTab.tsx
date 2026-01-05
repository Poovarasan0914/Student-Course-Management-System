import type { Admin } from '../../../types'
import { getId } from '../utils/helpers.ts'

interface AdminsTabProps {
    admins: Admin[]
    currentAdmin: Admin | null
    searchTerm: string
    setSearchTerm: (term: string) => void
    onDeleteAdmin: (adminId: string | number) => void
    onAddAdmin: () => void
}

export default function AdminsTab({
    admins,
    currentAdmin,
    searchTerm,
    setSearchTerm,
    onDeleteAdmin,
    onAddAdmin
}: AdminsTabProps) {
    const filteredAdmins = admins.filter((a: Admin) =>
        `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Admin Management</h2>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search admins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button
                        className="add-btn"
                        onClick={onAddAdmin}
                    >
                        + Add Admin
                    </button>
                </div>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.map((admin: Admin) => (
                            <tr key={getId(admin)}>
                                <td>{getId(admin)}</td>
                                <td>{admin.firstName} {admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => onDeleteAdmin(getId(admin)!)}
                                        disabled={getId(currentAdmin) === getId(admin)}
                                    >
                                        {getId(currentAdmin) === getId(admin) ? 'Current' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAdmins.length === 0 && (
                    <p className="no-data">No admins found</p>
                )}
            </div>
        </div>
    )
}
