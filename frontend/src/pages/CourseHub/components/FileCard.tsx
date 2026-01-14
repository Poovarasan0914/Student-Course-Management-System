import type { CourseMaterial } from '../../../types'

interface FileCardProps {
    material: CourseMaterial
    userRole: 'student' | 'staff'
    onDelete: () => void
    onDownload: () => void
    onView?: () => void
}

export default function FileCard({ material, userRole, onDelete, onDownload, onView }: FileCardProps) {
    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return 'bi-file-pdf-fill'
        if (fileType.includes('image')) return 'bi-file-image-fill'
        if (fileType.includes('word') || fileType.includes('document')) return 'bi-file-word-fill'
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'bi-file-ppt-fill'
        if (fileType.includes('zip')) return 'bi-file-zip-fill'
        return 'bi-file-earmark-fill'
    }

    const getFileIconColor = (fileType: string) => {
        if (fileType.includes('pdf')) return 'icon-pdf'
        if (fileType.includes('image')) return 'icon-image'
        if (fileType.includes('word') || fileType.includes('document')) return 'icon-word'
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'icon-ppt'
        if (fileType.includes('zip')) return 'icon-zip'
        return 'icon-default'
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Lecture Notes':
                return 'category-lecture'
            case 'Assignment':
                return 'category-assignment'
            case 'Study Material':
                return 'category-study'
            case 'Exam Preparation':
                return 'category-exam'
            default:
                return 'category-default'
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const isViewable = material.fileType.includes('pdf') || material.fileType.includes('image')

    return (
        <div className="file-card">
            <div className="file-card-header">
                <div className={`file-icon ${getFileIconColor(material.fileType)}`}>
                    <i className={getFileIcon(material.fileType)}></i>
                </div>
                <span className={`file-category ${getCategoryColor(material.category)}`}>
                    {material.category}
                </span>
            </div>

            <div className="file-card-body">
                <h4 className="file-title">{material.title}</h4>
                {material.description && (
                    <p className="file-description">{material.description}</p>
                )}
                <div className="file-meta">
                    <span className="file-name">
                        <i className="bi bi-file-text me-1"></i>
                        {material.fileName}
                    </span>
                    <span className="file-size">{formatFileSize(material.fileSize)}</span>
                </div>
            </div>

            <div className="file-card-footer">
                <div className="file-info">
                    <span className="uploaded-by">
                        <i className="bi bi-person-circle me-1"></i>
                        {material.uploadedByName}
                    </span>
                    <span className="upload-date">
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(material.createdAt)}
                    </span>
                </div>
                <div className="file-actions">
                    {isViewable && onView && (
                        <button
                            className="file-action-btn view-btn"
                            onClick={onView}
                            title="View"
                        >
                            <i className="bi bi-eye"></i>
                        </button>
                    )}
                    <button
                        className="file-action-btn download-btn"
                        onClick={onDownload}
                        title="Download"
                    >
                        <i className="bi bi-download"></i>
                    </button>
                    {userRole === 'staff' && (
                        <button
                            className="file-action-btn delete-btn"
                            onClick={onDelete}
                            title="Delete"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
