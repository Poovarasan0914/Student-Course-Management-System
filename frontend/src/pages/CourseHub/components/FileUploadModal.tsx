import { useState } from 'react'

interface FileUploadModalProps {
    onClose: () => void
    onUpload: (formData: FormData) => void
    isUploading: boolean
}

export default function FileUploadModal({ onClose, onUpload, isUploading }: FileUploadModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<string>('Lecture Notes')
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !file || !category) {
            alert('Please fill in all required fields')
            return
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title.trim())
        formData.append('description', description.trim())
        formData.append('category', category)

        onUpload(formData)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3><i className="bi bi-cloud-upload me-2"></i>Upload Course Material</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Week 5 Lecture Notes"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the material..."
                            className="form-textarea"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="Lecture Notes">Lecture Notes</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Study Material">Study Material</option>
                            <option value="Exam Preparation">Exam Preparation</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>File *</label>
                        <div
                            className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="file-input"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.ppt,.pptx,.zip"
                                required={!file}
                            />
                            {file ? (
                                <div className="selected-file">
                                    <i className="bi bi-file-earmark-check me-2"></i>
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">
                                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                    <button
                                        type="button"
                                        className="remove-file-btn"
                                        onClick={() => setFile(null)}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="drop-zone-content">
                                    <i className="bi bi-cloud-arrow-up"></i>
                                    <p>Drag & drop file here or click to browse</p>
                                    <span className="file-hint">
                                        PDF, Images, Word, PowerPoint, ZIP (Max 50MB)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="upload-btn"
                            disabled={isUploading || !file}
                        >
                            {isUploading ? (
                                <>
                                    <i className="bi bi-hourglass-split me-2"></i>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-cloud-upload me-2"></i>
                                    Upload
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
