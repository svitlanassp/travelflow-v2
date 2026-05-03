import { useEffect, useRef } from 'react';
import EventCard from '../EventCard/EventCard';
import './ScheduleTab.css';

function ScheduleTab({ trip, categoryFilter, onEventClick, onQuickAddClick }) {
    const todayRef = useRef(null); 
    
    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (todayRef.current) {
            todayRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [trip]); 
    
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

    const days = getDatesBetween(trip.start_date, trip.end_date);
    const isScrollable = days.length >= 6; 

    const filteredEvents = trip.places.filter(place => {
        if (categoryFilter === 'all') return true;
        return place.category === categoryFilter;
    });

    return (
        <div className="days-container">
            {days.map((dayDate) => {
                const dateString = dayDate.toISOString().split('T')[0]; 
                const isToday = dateString === todayStr; 

                const dayEvents = filteredEvents.filter(e => e.visit_date === dateString);

                dayEvents.sort((a, b) => {
                    if (!a.visit_time && !b.visit_time) return 0;
                    if (!a.visit_time) return 1;
                    if (!b.visit_time) return -1;
                    
                    return a.visit_time.localeCompare(b.visit_time);
                });

                return (
                    <div 
                        key={dateString}
                        ref={isToday ? todayRef : null}
                        className={`day-wrapper ${isScrollable ? 'fixed-width' : 'flexible-width'}`}
                    >
                        {isToday && <div className="today-badge">today</div>}
                        
                        <div className={`card day-column ${isToday ? 'is-today' : ''}`}>
                            <div className="day-header">
                                <span className="day-date">{formatDayDate(dayDate)}</span>
                                <span className="day-name">{formatDayName(dayDate)}</span>
                            </div>
                            
                            <div className="events-list">
                                {dayEvents.map(event => (
                                    <EventCard 
                                        key={event.id} 
                                        event={event} 
                                        onClick={() => onEventClick({ ...event, itemType: 'place' })} 
                                    />
                                ))}
                                
                                <button 
                                    className="quick-add-event-btn"
                                    onClick={() => onQuickAddClick(dateString)}
                                    title="Add event to this day"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ScheduleTab;