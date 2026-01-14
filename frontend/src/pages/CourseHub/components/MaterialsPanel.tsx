import { useState } from 'react'
import { useCourseMaterials, useUploadMaterial, useDeleteMaterial, downloadMaterial } from '../../../hooks/api'
import type { Course, CourseMaterial } from '../../../types'
import { getId } from '../../../utils/helpers'
import FileUploadModal from './FileUploadModal'
import FileCard from './FileCard'
import FilePreviewModal from './FilePreviewModal'

interface MaterialsPanelProps {
    course: Course
    userRole: 'student' | 'staff'
}

export default function MaterialsPanel({ course, userRole }: MaterialsPanelProps) {
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(null)

    const courseId = String(getId(course))
    const { data: materials = [], isLoading } = useCourseMaterials(courseId)
    const uploadMaterial = useUploadMaterial()
    const deleteMaterial = useDeleteMaterial()

    const categories = ['all', 'Lecture Notes', 'Assignment', 'Study Material', 'Exam Preparation']

    const filteredMaterials = selectedCategory === 'all'
        ? materials
        : materials.filter((m: CourseMaterial) => m.category === selectedCategory)

    const handleUpload = async (formData: FormData) => {
        try {
            await uploadMaterial.mutateAsync({ courseId, formData })
            setShowUploadModal(false)
        } catch (error) {
            console.error('Failed to upload material:', error)
            alert('Failed to upload file. Please try again.')
        }
    }

    const handleDelete = async (materialId: string) => {
        if (!confirm('Delete this material? This action cannot be undone.')) return

        try {
            await deleteMaterial.mutateAsync({ materialId, courseId })
        } catch (error) {
            console.error('Failed to delete material:', error)
            alert('Failed to delete file.')
        }
    }

    const handleDownload = async (material: CourseMaterial) => {
        try {
            await downloadMaterial(material._id, material.fileName)
        } catch (error) {
            console.error('Failed to download material:', error)
            alert('Failed to download file.')
        }
    }

    const handleView = (material: CourseMaterial) => {
        setPreviewMaterial(material)
    }

    const isViewable = (fileType: string) => {
        return fileType.includes('pdf') || fileType.includes('image')
    }

    return (
        <div className="materials-panel">
            <div className="materials-header">
                <div>
                    <h3><i className="bi bi-folder me-2"></i>{course.title} - Materials</h3>
                    <p className="materials-subtitle">
                        <i className="bi bi-file-earmark me-1"></i>
                        Access course materials, notes, and resources
                    </p>
                </div>
                {userRole === 'staff' && (
                    <button
                        className="upload-button"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <i className="bi bi-cloud-upload me-2"></i>Upload Material
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category === 'all' ? 'All' : category}
                    </button>
                ))}
            </div>

            {/* Materials List */}
            <div className="materials-container">
                {isLoading ? (
                    <div className="loading-materials">
                        <div className="spinner"></div>
                        <p>Loading materials...</p>
                    </div>
                ) : filteredMaterials.length === 0 ? (
                    <div className="no-materials">
                        <i className="bi bi-folder2-open"></i>
                        <p>No materials yet</p>
                        <span>
                            {userRole === 'staff'
                                ? 'Click "Upload Material" to add resources'
                                : 'Check back later for course materials'}
                        </span>
                    </div>
                ) : (
                    <div className="materials-grid">
                        {filteredMaterials.map((material: CourseMaterial) => (
                            <FileCard
                                key={material._id}
                                material={material}
                                userRole={userRole}
                                onDelete={() => handleDelete(material._id)}
                                onDownload={() => handleDownload(material)}
                                onView={isViewable(material.fileType) ? () => handleView(material) : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <FileUploadModal
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUpload}
                    isUploading={uploadMaterial.isPending}
                />
            )}

            {/* Preview Modal */}
            {previewMaterial && (
                <FilePreviewModal
                    material={previewMaterial}
                    onClose={() => setPreviewMaterial(null)}
                />
            )}
        </div>
    )
}
