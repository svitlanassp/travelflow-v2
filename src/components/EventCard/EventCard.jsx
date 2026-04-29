import { getCategoryStyle } from '../../constants/categories';
import { motion } from 'framer-motion'; 
import './EventCard.css';

function EventCard({ event, onClick }) {
    const categoryStyle = getCategoryStyle(event.category);
    const timeString = event.visit_time ? event.visit_time.slice(0, 5) : null;
    const cost = parseFloat(event.cost);
    const hasCost = cost > 0;

    return (
        <motion.div
            layoutId={`event-card-${event.id}`} 
            className="event-card"
            onClick={onClick}
            style={{
                '--event-bg': categoryStyle.bg,
                '--event-main': categoryStyle.main,
                '--event-dark': categoryStyle.dark
            }}
            whileHover={{ 
                y: -2, 
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)" 
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
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
        </motion.div>
    );
}

export default EventCard;