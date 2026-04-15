import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { api } from '../services/api';
import { CATEGORY_STYLES } from '../constants/categories'; 
import './SchedulePage.css';

function SchedulePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const getDatesBetween = (startStr, endStr) => {
        const dates = [];
        let current = new Date(startStr);
        const end = new Date(endStr);
        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const formatDayDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
    const formatDayName = (date) => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date).toLowerCase();

    if (loading) {
        return (
            <div className="app-wrapper">
                <Header />
                <div className="page-container loading-container">
                    <div className="loading-state">loading schedule...</div>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    const days = getDatesBetween(trip.start_date, trip.end_date);
    const isScrollable = days.length >= 6; 

    const filteredEvents = trip.places.filter(place => {
        if (categoryFilter === 'all') return true;
        return place.category === categoryFilter;
    });

    const filterOptions = [
        { id: 'all', label: 'all categories', icon: '🌍', bg: 'var(--purple-light)', main: 'var(--purple-main)' },
        ...Object.entries(CATEGORY_STYLES).map(([key, value]) => ({
            id: key,
            ...value
        }))
    ];

    const selectedOption = filterOptions.find(opt => opt.id === categoryFilter);

    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container schedule-container">
                
                <div className="subheader">
                    <div className="subheader-left">
                        <button className="back-btn" onClick={() => navigate('/trips')}>
                            ←
                        </button>
                        
                        <div className="trip-title-wrapper">
                            <h1 className="trip-title">{trip.title}</h1>
                            <span className="edit-icon">✎</span>
                        </div>

                        <div className="tabs">
                            <button className="tab active">schedule</button>
                            <button className="tab">budget</button>
                        </div>
                    </div>

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
                                            style={{
                                                '--hover-bg': option.bg,
                                                '--item-color': option.dark
                                            }}
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
                </div>

                <div className="days-container">
                    {days.map((dayDate) => {
                        const dateString = dayDate.toISOString().split('T')[0]; 
                        const dayEvents = filteredEvents.filter(e => e.visit_date === dateString);

                        return (
                            <div 
                                key={dateString} 
                                className={`card day-column ${isScrollable ? 'fixed-width' : 'flexible-width'}`}
                            >
                                <div className="day-header">
                                    <span className="day-date">{formatDayDate(dayDate)}</span>
                                    <span className="day-name">{formatDayName(dayDate)}</span>
                                </div>
                                
                                <div className="events-list">
                                    {dayEvents.length === 0 ? (
                                        <p className="no-events">no plans yet</p>
                                    ) : (
                                        dayEvents.map(event => (
                                            <div key={event.id} className="event-placeholder">
                                                {event.visit_time ? event.visit_time.slice(0,5) + ' - ' : ''} {event.title}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default SchedulePage;