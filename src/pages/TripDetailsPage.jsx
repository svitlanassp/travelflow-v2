import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import ScheduleTab from '../components/ScheduleTab/ScheduleTab';
import BudgetTab from '../components/BudgetTab/BudgetTab';
import AddExpenseModal from '../components/AddExpenseModal/AddExpenseModal';
import { api } from '../services/api';
import { CATEGORY_STYLES } from '../constants/categories'; 
import './TripDetailsPage.css';

function TripDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState('schedule'); 
    
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const data = await api.getTrip(id);
                setTrip(data);
            } catch (error) {
                console.error("Error fetching trip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTripDetails();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="app-wrapper">
                <Header />
                <div className="page-container loading-container">
                    <div className="loading-state">loading trip details...</div>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    const filterOptions = [
        { id: 'all', label: 'all categories', icon: '🌍', bg: 'var(--purple-light)', main: 'var(--purple-main)' },
        ...Object.entries(CATEGORY_STYLES).map(([key, value]) => ({
            id: key, ...value
        }))
    ];
    const selectedOption = filterOptions.find(opt => opt.id === categoryFilter);

    const handleExpenseAdded = (newExpense) => {
        setTrip(prevTrip => ({
            ...prevTrip,
            expenses: [...prevTrip.expenses, newExpense],
            // Одразу плюсуємо до загальної суми, щоб прогрес-бари перемалювалися
            total_spent: (parseFloat(prevTrip.total_spent || 0) + parseFloat(newExpense.amount)).toString()
        }));
        setIsAddExpenseOpen(false);
    };

    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container trip-details-container">
                
                <div className="subheader">
                    <div className="subheader-left">
                        <button className="back-btn" onClick={() => navigate('/trips')}>←</button>
                        
                        <div className="trip-title-wrapper">
                            <h1 className="trip-title">{trip.title}</h1>
                            <span className="edit-icon">✎</span>
                        </div>

                        <div className="tabs">
                            <div className={`tab-glider ${activeTab}`}></div>
                            <button 
                                className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                                onClick={() => setActiveTab('schedule')}
                            >schedule</button>
                            <button 
                                className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
                                onClick={() => setActiveTab('budget')}
                            >budget</button>
                        </div>
                    </div>

                    {activeTab === 'schedule' && (
                        <div className="subheader-right">
                            <div className="custom-dropdown" ref={dropdownRef}>
                                <button 
                                    className="custom-dropdown-trigger"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="dropdown-icon">{selectedOption.icon}</span>
                                    <span className="dropdown-label">{selectedOption.label}</span>
                                    <span className="dropdown-arrow">▼</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="custom-dropdown-menu">
                                        {filterOptions.map(option => (
                                            <button
                                                key={option.id}
                                                className={`custom-dropdown-item ${categoryFilter === option.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setCategoryFilter(option.id);
                                                    setIsDropdownOpen(false);
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
                            <button className="btn-primary btn-add">+</button>
                        </div>
                    )}
                </div>

                {activeTab === 'schedule' ? (
                    <ScheduleTab trip={trip} categoryFilter={categoryFilter} />
                ) : (
                    <BudgetTab trip={trip} onAddExpense={() => setIsAddExpenseOpen(true)}/>
                )}

            </div>
            <AddExpenseModal 
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
                tripId={trip.id}
                onExpenseAdded={handleExpenseAdded}
            />
        </div>
    );
}

export default TripDetailsPage;