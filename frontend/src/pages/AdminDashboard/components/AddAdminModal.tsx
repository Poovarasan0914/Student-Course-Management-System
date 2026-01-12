import type { NewAdminForm } from '../hooks/useAdminDashboard'

interface AddAdminModalProps {
    isOpen: boolean
    newAdmin: NewAdminForm
    setNewAdmin: (admin: NewAdminForm) => void
    onClose: () => void
    onSave: () => void
}

export default function AddAdminModal({
    isOpen,
    newAdmin,
    setNewAdmin,
    onClose,
    onSave
}: AddAdminModalProps) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Admin</h2>
                <div className="modal-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={newAdmin.firstName}
                            onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={newAdmin.lastName}
                            onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={onSave}>
                        Add Admin
                    </button>
                </div>
            </div>
        </div>
    )
}
