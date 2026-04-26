import { useState, useRef, useEffect } from 'react';
import { CATEGORY_STYLES } from '../../constants/categories';

function CategoryFilterDropdown({ categoryFilter, setCategoryFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Закриваємо по кліку зовні
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Формуємо опції
    const filterOptions = [
        { id: 'all', label: 'all categories', icon: '🌍', bg: 'var(--purple-light)', main: 'var(--purple-main)' },
        ...Object.entries(CATEGORY_STYLES).map(([key, value]) => ({ id: key, ...value }))
    ];
    const selectedOption = filterOptions.find(opt => opt.id === categoryFilter);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button 
                className="custom-dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="dropdown-icon">{selectedOption.icon}</span>
                <span className="dropdown-label">{selectedOption.label}</span>
                <span className="dropdown-arrow">▼</span>
            </button>

            {isOpen && (
                <div className="custom-dropdown-menu">
                    {filterOptions.map(option => (
                        <button
                            key={option.id}
                            className={`custom-dropdown-item ${categoryFilter === option.id ? 'active' : ''}`}
                            onClick={() => {
                                setCategoryFilter(option.id);
                                setIsOpen(false);
                            }}
                            style={{ '--hover-bg': option.bg, '--item-color': option.dark }}
                        >
                            <span className="item-icon">{option.icon}</span>
                            <span className="item-label">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryFilterDropdown;