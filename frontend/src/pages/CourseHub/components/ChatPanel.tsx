import { useState, useEffect, useRef } from 'react'
import { useCourseMessages, useSendMessage, useDeleteMessage } from '../../../hooks/api'
import type { Course, Student, Staff, Message } from '../../../types'
import { getId } from '../../../utils/helpers'
import EmojiPicker from './EmojiPicker'

interface ChatPanelProps {
    course: Course
    currentUser: Student | Staff | null
    userRole: 'student' | 'staff'
}

export default function ChatPanel({ course, currentUser, userRole: _userRole }: ChatPanelProps) {
    const [messageInput, setMessageInput] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const courseId = String(getId(course))
    const { data: messages = [], isLoading } = useCourseMessages(courseId)
    const sendMessage = useSendMessage()
    const deleteMessage = useDeleteMessage()

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageInput.trim()) return

        try {
            // Detect if message contains URL
            const urlPattern = /(https?:\/\/[^\s]+)/g
            const messageType = urlPattern.test(messageInput) ? 'link' : 'text'

            await sendMessage.mutateAsync({
                courseId,
                content: messageInput.trim(),
                messageType
            })
            setMessageInput('')
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Delete this message?')) return

        try {
            await deleteMessage.mutateAsync({ messageId, courseId })
        } catch (error) {
            console.error('Failed to delete message:', error)
        }
    }

    const handleEmojiSelect = (emoji: string) => {
        setMessageInput(prev => prev + emoji)
        setShowEmojiPicker(false)
    }

    const isOwnMessage = (message: Message) => {
        return message.senderId === getId(currentUser)
    }

    const renderMessageContent = (content: string) => {
        // Parse URLs and make them clickable
        const urlPattern = /(https?:\/\/[^\s]+)/g
        const parts = content.split(urlPattern)

        return parts.map((part, index) => {
            if (urlPattern.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="message-link"
                    >
                        {part}
                    </a>
                )
            }
            return part
        })
    }

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h3><i className="bi bi-chat-dots me-2"></i>{course.title} - Chat</h3>
                <p className="chat-subtitle">
                    <i className="bi bi-people me-1"></i>
                    Ask questions, discuss topics, and collaborate
                </p>
            </div>

            <div className="messages-container">
                {isLoading ? (
                    <div className="loading-messages">
                        <div className="spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <i className="bi bi-chat-text"></i>
                        <p>No messages yet</p>
                        <span>Be the first to start the conversation!</span>
                    </div>
                ) : (
                    <div className="messages-list">
                        {messages.map((message: Message) => (
                            <div
                                key={message._id}
                                className={`message ${isOwnMessage(message) ? 'own-message' : ''} ${message.senderRole === 'staff' ? 'staff-message' : 'student-message'}`}
                            >
                                <div className="message-header">
                                    <span className="sender-name">
                                        {message.senderName}
                                        {message.senderRole === 'staff' && (
                                            <span className="staff-badge">
                                                <i className="bi bi-mortarboard-fill"></i> Staff
                                            </span>
                                        )}
                                    </span>
                                    <span className="message-time">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="message-content">
                                    {renderMessageContent(message.content)}
                                </div>
                                {isOwnMessage(message) && (
                                    <button
                                        className="delete-message-btn"
                                        onClick={() => handleDeleteMessage(message._id)}
                                        title="Delete message"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <form className="message-input-form" onSubmit={handleSendMessage}>
                <div className="input-wrapper">
                    <button
                        type="button"
                        className="emoji-btn"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <i className="bi bi-emoji-smile"></i>
                    </button>
                    {showEmojiPicker && (
                        <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                    )}
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                        disabled={sendMessage.isPending}
                    />
                </div>
                <button
                    type="submit"
                    className="send-button"
                    disabled={!messageInput.trim() || sendMessage.isPending}
                >
                    {sendMessage.isPending ? (
                        <i className="bi bi-hourglass-split"></i>
                    ) : (
                        <i className="bi bi-send-fill"></i>
                    )}
                </button>
            </form>
        </div>
    )
}
