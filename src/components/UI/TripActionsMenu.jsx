import { useState, useRef, useEffect } from 'react';
import EditIcon from '../../icons/edit.svg?react';
import DeleteIcon from '../../icons/delete.svg?react';
import './TripActionsMenu.css';

// variant може бути 'pill-horizontal' або 'icon-vertical'
function TripActionsMenu({ variant = 'pill-horizontal', onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const timeoutRef = useRef(null);

    // Закриття по кліку зовні
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200); // 200 мс — ідеально, щоб перенести мишку
    };

    // Важливо: зупиняємо propagation, щоб клік по меню не відкривав сторінку TripDetails
    const handleActionClick = (e, action) => {
        e.stopPropagation();
        setIsOpen(false);
        if (action === 'edit' && onEdit) onEdit();
        if (action === 'delete' && onDelete) onDelete();
    };

    return (
        <div className={`trip-actions-container ${variant}`} 
             ref={menuRef} 
             onMouseLeave={() => setIsOpen(false)}
             onMouseEnter={handleMouseEnter} // 👈 ДОДАЛИ
             onMouseLeave={handleMouseLeave} // 👈 ДОДАЛИ
        >
            <button 
                className={`actions-trigger ${variant}`}
                onClick={(e) => {
                    e.stopPropagation(); // Не відкриваємо картку
                    setIsOpen(!isOpen);
                }}
            >
                {variant === 'pill-horizontal' ? '⋯' : '⋮'}
            </button>

            {isOpen && (
                <div className="actions-dropdown">
                    <button 
                        className="action-item edit-action"
                        onClick={(e) => handleActionClick(e, 'edit')}
                    >
                        {/* Використовуй свої іконки, якщо маєш, або просто текст */}
                        <span className="action-icon">✎</span> edit
                    </button>
                    <button 
                        className="action-item delete-action"
                        onClick={(e) => handleActionClick(e, 'delete')}
                    >
                        <span className="action-icon">🗑️</span> delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default TripActionsMenu;