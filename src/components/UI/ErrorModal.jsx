import './Modal.css';

function ErrorModal({ 
    isOpen, 
    onClose, 
    title = "oops, something went wrong", 
    message 
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="card error-card" onClick={e => e.stopPropagation()}>
                <div className="error-header">
                    <h2 className="error-title">{title}</h2>
                </div>
                
                <div className="error-text">
                    {message}
                </div>
                
                <div className="error-actions">
                    <button className="btn-danger" onClick={onClose}>
                        ok, got it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorModal;