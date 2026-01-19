import type { CourseMaterial } from '../../../types'

// Base URL for file serving (without /api)
const BASE_URL = 'http://localhost:5000'

interface FilePreviewModalProps {
    material: CourseMaterial
    onClose: () => void
}

export default function FilePreviewModal({ material, onClose }: FilePreviewModalProps) {
    const isPdf = material.fileType.includes('pdf')
    const isImage = material.fileType.includes('image')

    // Construct the file URL properly
    const getFileUrl = () => {
        // If already a full URL, use it
        if (material.fileUrl.startsWith('http')) {
            return material.fileUrl
        }
        // Otherwise, prepend the base URL
        // fileUrl is typically like "/uploads/materials/filename.pdf"
        return `${BASE_URL}${material.fileUrl}`
    }

    const fileUrl = getFileUrl()
    // For PDFs, add toolbar parameter
    const previewUrl = isPdf ? `${fileUrl}#toolbar=1` : fileUrl

    return (
        <div className="modal-overlay preview-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                <div className="preview-header">
                    <div className="preview-title">
                        <i className={isPdf ? 'bi bi-file-pdf' : 'bi bi-file-image'}></i>
                        <span>{material.title}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="preview-content">
                    {isPdf ? (
                        <iframe
                            src={previewUrl}
                            title={material.title}
                            className="pdf-preview"
                        />
                    ) : isImage ? (
                        <div className="image-preview-container">
                            <img
                                src={fileUrl}
                                alt={material.title}
                                className="image-preview"
                            />
                        </div>
                    ) : (
                        <div className="unsupported-preview">
                            <i className="bi bi-file-earmark-x"></i>
                            <p>Preview not available for this file type</p>
                        </div>
                    )}
                </div>

                <div className="preview-footer">
                    <div className="preview-info">
                        <span className="preview-filename">
                            <i className="bi bi-file-text me-1"></i>
                            {material.fileName}
                        </span>
                        <span className="preview-category">
                            <i className="bi bi-tag me-1"></i>
                            {material.category}
                        </span>
                    </div>
                    <a
                        href={fileUrl}
                        download={material.fileName}
                        className="download-preview-btn"
                    >
                        <i className="bi bi-download me-2"></i>
                        Download
                    </a>
                </div>
            </div>
        </div>
    )
}

