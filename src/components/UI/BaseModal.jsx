import './Modal.css';

function BaseModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="form-modal-card" onClick={e => e.stopPropagation()}>
                
                <div className="modal-header-accent">
                    <h2 className="modal-header-title">{title} ✦</h2>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>
                
            </div>
        </div>
    );
}

export default BaseModal;