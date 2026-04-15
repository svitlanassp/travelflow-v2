import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { api } from '../services/api';
import './SchedulePage.css';

// Конфіг для селекта категорій
import { CATEGORY_STYLES } from '../constants/categories'; 
// Якщо ти ще не створила цей імпорт, просто використай об'єкт з минулого чату або залиш 'all' 

function SchedulePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');

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

    // Хелпер: Отримуємо масив усіх дат від start_date до end_date
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

    // Хелпери для форматування (наприклад "June 10" та "thu")
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

    // Фільтруємо івенти (places) за категорією
    const filteredEvents = trip.places.filter(place => {
        if (categoryFilter === 'all') return true;
        return place.category === categoryFilter;
    });

    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container schedule-container">
                
                {/* SUBHEADER */}
                <div className="subheader">
                    <div className="subheader-left">
                        <button className="back-btn" onClick={() => navigate('/trips')}>
                            ←
                        </button>
                        
                        <div className="trip-title-wrapper">
                            <h1 className="trip-title">{trip.title}</h1>
                            {/* Іконка олівця (можеш замінити на свою SVG) */}
                            <span className="edit-icon">✎</span>
                        </div>

                        <div className="tabs">
                            <button className="tab active">schedule</button>
                            <button className="tab">budget</button>
                        </div>
                    </div>

                    <div className="subheader-right">
                        <select 
                            className="category-filter"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="transport">Transport</option>
                            <option value="food">Food & Drinks</option>
                            <option value="sightseeing">Sightseeing</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping">Shopping</option>
                            <option value="others">Others</option>
                        </select>
                        <button className="btn-primary btn-add">+</button>
                    </div>
                </div>

                {/* CALENDAR / DAYS CONTAINER */}
                <div className="days-container">
                    {days.map((dayDate) => {
                        const dateString = dayDate.toISOString().split('T')[0]; 
                        const dayEvents = filteredEvents.filter(e => e.visit_date === dateString);

                        return (
                            <div 
                                key={dateString} 
                                // Використовуємо класи замість інлайн-стилів
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