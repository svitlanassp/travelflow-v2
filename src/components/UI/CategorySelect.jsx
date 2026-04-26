import { useState, useRef, useEffect } from 'react';
import { CATEGORY_STYLES } from '../../constants/categories';
import './CategorySelect.css';

function CategorySelect({ label, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCategory = CATEGORY_STYLES[value];

    return (
        <div className="category-select-group" ref={dropdownRef}>
            {label && <label className="input-label">{label}</label>}
            
            <div 
                className={`select-trigger ${isOpen ? 'open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedCategory ? (
                    <div 
                        className="selected-badge"
                        style={{ 
                            backgroundColor: selectedCategory.bg, 
                            color: selectedCategory.dark 
                        }}
                    >
                        <span>{selectedCategory.icon}</span>
                        <span>{selectedCategory.label}</span>
                    </div>
                ) : (
                    <span className="placeholder">select category</span>
                )}
                <span className="select-arrow">▼</span>
            </div>

            {isOpen && (
                <div className="select-menu">
                    {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                        <button
                            key={key}
                            type="button"
                            className={`select-item ${value === key ? 'active' : ''}`}
                            onClick={() => {
                                onChange(key);
                                setIsOpen(false);
                            }}
                            style={{ 
                                '--hover-bg': style.bg, 
                                '--hover-color': style.dark 
                            }}
                        >
                            <span className="item-icon">{style.icon}</span>
                            <span className="item-label">{style.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategorySelect;