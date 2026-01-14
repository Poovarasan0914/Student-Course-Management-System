interface EmojiPickerProps {
    onSelect: (emoji: string) => void
    onClose: () => void
}

const EMOJI_LIST = [
    '😀', '😃', '😄', '😁', '😊', '🙂', '😉', '😍',
    '🤔', '😮', '😯', '😲', '🙄', '😏', '😌', '🤗',
    '👍', '👎', '👏', '🙌', '💪', '✌️', '🤞', '👋',
    '❤️', '💯', '🔥', '⭐', '✨', '💡', '📚', '📝',
    '✅', '❌', '❓', '❗', '⚠️', '📌', '🎯', '🎉',
    '👨‍🏫', '👩‍🎓', '📖', '📊', '💻', '🖥️', '📁', '📎'
]

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
    return (
        <div className="emoji-picker">
            <div className="emoji-picker-header">
                <span>Emojis</span>
                <button className="emoji-close-btn" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
            </div>
            <div className="emoji-grid">
                {EMOJI_LIST.map((emoji, index) => (
                    <button
                        key={index}
                        type="button"
                        className="emoji-item"
                        onClick={() => onSelect(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    )
}
