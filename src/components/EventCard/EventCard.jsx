import { getCategoryStyle } from '../../constants/categories';
import './EventCard.css';

function EventCard({ event }) {
    const categoryStyle = getCategoryStyle(event.category);
    const timeString = event.visit_time ? event.visit_time.slice(0, 5) : null;
    const cost = parseFloat(event.cost);
    const hasCost = cost > 0;

    return (
        <div 
            className="event-card"
            // Магія тут! Прокидаємо кольори з констант у CSS
            style={{
                '--event-bg': categoryStyle.bg,
                '--event-main': categoryStyle.main,
                '--event-dark': categoryStyle.dark
            }}
        >
            <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                {timeString && <span className="event-time">{timeString}</span>}
            </div>

            <div className="event-footer">
                <div className="event-category-badge">
                    <span className="event-category-label">{categoryStyle.label}</span>
                </div>

                {hasCost && <div className="event-cost">${cost.toFixed(2)}</div>}
            </div>
        </div>
    );
}

export default EventCard;