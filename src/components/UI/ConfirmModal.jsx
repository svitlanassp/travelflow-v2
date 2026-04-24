import './Modal.css';

function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'confirm', 
    cancelText = 'cancel',
    isProcessing = false 
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="card confirm-card" onClick={e => e.stopPropagation()}>
                <h2 className="confirm-title">{title}</h2>
                <div className="confirm-text">
                    {message}
                </div>
                <div className="confirm-actions">
                    <button 
                        className="btn-secondary" 
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className="btn-danger" 
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;